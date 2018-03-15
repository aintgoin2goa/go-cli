package aws

import (
	"fmt"
	"testing"
)

func TestGetSecurityGroup(t *testing.T) {
	securityGroupId := "sg-56b8c42f"
	region := "eu-west-1"
	result, err := GetSecurityGroup(securityGroupId, region)
	if err != nil {
		t.Error(err)
	}

	fmt.Printf("%+v/n", result.IpPermissions)
}

func TestGetIngressIps(t *testing.T) {
	securityGroupId := "sg-56b8c42f"
	region := "eu-west-1"
	protocol := "http"
	result, err := GetIngressIps(securityGroupId, region, protocol)
	if err != nil {
		t.Error(err)
	}

	fmt.Printf("%+v/n", result)
}

func TestAddIngressIp(t *testing.T) {
	securityGroupId := "sg-56b8c42f"
	region := "eu-west-1"
	protocol := "http"
	ip := "82.173.135.22"
	name := "Paul Wilson TEST"
	err := AddIngressIp(securityGroupId, region, protocol, ip, name)
	if err != nil {
		t.Error(err)
	}
}
