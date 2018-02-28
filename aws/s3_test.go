package aws

import (
	"fmt"
	"reflect"
	"testing"
)

func TestGetEnvironmentVariablesFromS3(t *testing.T) {
	bucket := "deployment-dashboard-dazn-env"
	key := "local.json"
	result := GetEnvironmentVariablesFromS3(bucket, key)
	expectedKey := "API_KEY"

	if reflect.ValueOf(result).Kind() != reflect.Map {
		t.Error("Result is not a map")
	}

	fmt.Printf("Result was %+v \n", result)

	_, hasAPIKey := result[expectedKey]

	if !hasAPIKey {
		t.Error("Result did not contain expected key")
	}
}
