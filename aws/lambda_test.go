package aws

import (
	"reflect"
	"testing"
)

var function = "lambda-dazn-tube-core-engine-builder-testing"

func TestGetLambdaEnvironmentVariables(t *testing.T) {
	result := GetLambdaEnvironmentVariables(function)

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

func TestGetFunctionInfo(t *testing.T) {
	result := GetFunctionInfo(function)

	if result.Name != function {
		t.Error("Did not get expected info")
	}
}
