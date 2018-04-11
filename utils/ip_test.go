package utils

import (
	"fmt"
	"testing"
)

func TestGetCurrentIp(t *testing.T) {
	ip, err := GetCurrentIP()
	if err != nil {
		t.Error(err)
	}

	fmt.Printf("IP: %s", ip)
}
