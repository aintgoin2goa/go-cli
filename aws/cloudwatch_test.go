package aws

import (
	"fmt"
	"testing"
)

func TestGetLogStreams(t *testing.T) {
	result, error := GetLogStreamsForLambda("lambda-dazn-tube-choco-multiplier-testing")
	if error != nil {
		t.Error(error)
	}

	fmt.Printf("%#v", result)
}

func TestGetLogsForStream(t *testing.T) {

	funcName := "lambda-dazn-tube-choco-multiplier-testing"
	streams, error := GetLogStreamsForLambda(funcName)
	if error != nil {
		t.Error(error)
	}
	stream := streams[0]

	result, error := GetLogsForStream(funcName, stream)
	if error != nil {
		t.Error(error)
	}

	fmt.Print(result)
}
