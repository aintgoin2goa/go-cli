package aws

import (
	"errors"
	"net"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
)

type IpRecord struct {
	Ip          string
	Description string
}

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

func GetSecurityGroup(groupId, region string) (*ec2.SecurityGroup, error) {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	svc := ec2.New(sess, &aws.Config{Region: aws.String(region)})
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

func AddIngressIp(groupId string, region string, protocol string, ipString string, name string) error {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	ip := net.ParseIP(ipString)
	if ip == nil {
		return errors.New("Invalid IP")
	}
	var cidrIp string
	if ip.To4 != nil {
		cidrIp = ip.String() + "/32"
	} else {
		cidrIp = ip.String()
	}
	svc := ec2.New(sess, &aws.Config{Region: aws.String(region)})
	port := portForProtocol(protocol)
	input := &ec2.AuthorizeSecurityGroupIngressInput{
		GroupId:    aws.String(groupId),
		IpProtocol: aws.String("tcp"),
		FromPort:   aws.Int64(port),
		ToPort:     aws.Int64(port),
		CidrIp:     aws.String(cidrIp),
	}

	_, err := svc.AuthorizeSecurityGroupIngress(input)
	if err != nil {
		return err
	}

	return nil
}
