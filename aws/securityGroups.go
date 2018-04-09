package aws

import (
	"errors"
	"net"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
)

type IpRecord struct {
	Ip          string
	Description string
}

const timeFormat = time.RFC822

func createIpRecords(ranges []*ec2.IpRange) []IpRecord {
	var records []IpRecord
	for _, r := range ranges {
		record := IpRecord{Ip: *r.CidrIp, Description: *r.Description}
		records = append(records, record)
	}

	return records
}

func matchProtocol(protocol string, permission *ec2.IpPermission) bool {
	switch protocol {
	case "http":
		return (*permission.IpProtocol == "tcp" && *permission.FromPort == 80)
	case "https":
		return (*permission.IpProtocol == "tcp" && *permission.FromPort == 443)
	case "ssh":
		return (*permission.IpProtocol == "tcp" && *permission.FromPort == 22)
	}

	return false
}

func portForProtocol(protocol string) int64 {
	switch protocol {
	case "http":
		return 80
	case "https":
		return 443
	case "ssh":
		return 22
	default:
		return 80
	}
}

func getService(region string) *ec2.EC2 {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	svc := ec2.New(sess, &aws.Config{Region: aws.String(region)})
	return svc
}

func getIpAsCidr(ipString string) (string, error) {
	ip := net.ParseIP(ipString)
	if ip == nil {
		return "", errors.New("Invalid IP")
	}
	var cidrIp string
	if ip.To4 != nil {
		cidrIp = ip.String() + "/32"
	} else {
		cidrIp = ip.String()
	}

	return cidrIp, nil
}

func GetSecurityGroup(groupId, region string) (*ec2.SecurityGroup, error) {
	svc := getService(region)
	input := &ec2.DescribeSecurityGroupsInput{
		GroupIds: []*string{aws.String(groupId)},
	}

	result, err := svc.DescribeSecurityGroups(input)
	if err != nil {
		return nil, err
	}

	return result.SecurityGroups[0], nil
}

func GetIngressIps(groupId string, region string, protocol string) ([]IpRecord, error) {
	group, err := GetSecurityGroup(groupId, region)
	if err != nil {
		return nil, err
	}

	for _, permission := range group.IpPermissions {
		if matchProtocol(protocol, permission) {
			return createIpRecords(permission.IpRanges), nil
		}
	}

	return nil, errors.New("Failed to find any ips matching that protocol")
}

func AddIngressIp(groupId string, region string, protocol string, ipString string, name string, expiryInDays int) error {
	svc := getService(region)
	cidrIp, ipErr := getIpAsCidr(ipString)
	if ipErr != nil {
		return ipErr
	}

	var timestamp string

	if expiryInDays == 0 {
		timestamp = ""
	} else {
		expiry := time.Now().AddDate(0, 0, expiryInDays)
		timestamp = "[" + expiry.Format(timeFormat) + "]"
	}

	port := portForProtocol(protocol)
	input := &ec2.AuthorizeSecurityGroupIngressInput{
		GroupId: aws.String(groupId),
		IpPermissions: []*ec2.IpPermission{
			(&ec2.IpPermission{}).
				SetIpProtocol("tcp").
				SetFromPort(port).
				SetToPort(port).
				SetIpRanges([]*ec2.IpRange{
					&ec2.IpRange{
						CidrIp:      aws.String(cidrIp),
						Description: aws.String(name + " " + timestamp),
					},
				}),
		},
	}

	_, err := svc.AuthorizeSecurityGroupIngress(input)
	if err != nil {
		return err
	}

	return nil
}

type CleanOldIngressRulesResult struct {
	RulesRemoved []string
	RemovedCount int
}

func RemoveIngressRule(groupId string, region string, protocol string, ipString string) error {
	svc := getService(region)
	cidrIp, err := getIpAsCidr(ipString)
	if err != nil {
		return err
	}
	port := portForProtocol(protocol)
	input := &ec2.RevokeSecurityGroupIngressInput{
		CidrIp:     aws.String(cidrIp),
		FromPort:   aws.Int64(port),
		ToPort:     aws.Int64(port),
		IpProtocol: aws.String("tcp"),
		GroupId:    aws.String(groupId),
	}

	_, revokeError := svc.RevokeSecurityGroupIngress(input)

	if revokeError != nil {
		return revokeError
	}

	return nil
}
