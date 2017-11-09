package utils

import "testing"

func TestConvertMapToYaml(t *testing.T) {
	testMap := make(map[string]string)
	testMap["foo"] = "bar"
	testMap["baz"] = "blah"
	yml, err := ConvertMapToYaml(testMap)
	result := string(yml[:])

	if err != nil {
		t.Error("Test failed", err)
	}

	t.Log(result)
}
