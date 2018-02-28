package aws

import (
	"reflect"
	"testing"
)

func TestGetLambdaEnvironmentVariables(t *testing.T) {
	result := GetLambdaEnvironmentVariables("dazn-team-frontend-lambda-tube-core-engine-builder-test")

	if reflect.ValueOf(result).Kind() != reflect.Map {
		t.Error("result is not a map")
	}

	environment, hasEnvironment := result["ENVIRONMENT"]

	if !hasEnvironment {
		t.Error("Missing ENVIRONMENT key")
	}

	if environment != "test" {
		t.Error("ENVIRONMENT is " + environment + " instead of 'test'")
	}
}
