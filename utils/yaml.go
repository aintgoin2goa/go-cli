package utils

import (
	"fmt"

	"gopkg.in/yaml.v2"
)

func ConvertMapToYaml(input map[string]string) ([]byte, error) {
	yml, err := yaml.Marshal(input)
	if err != nil {
		fmt.Println(err)
		return make([]byte, 0), err
	}

	return yml, nil
}
