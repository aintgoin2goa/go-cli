package commands

import (
	"encoding/json"
	"fmt"
	"go-cli/aws"
	"go-cli/utils"
	"io/ioutil"
	"log"
	"strings"

	"github.com/urfave/cli"
)

type envSource func() map[string]string

func envSourceResolver(lambda string, bucket string, key string) envSource {
	if lambda != "" && bucket == "" && key == "" {
		return func() map[string]string {
			return aws.GetLambdaEnvironmentVariables(lambda)
		}
	}

	if bucket != "" && key != "" {
		return func() map[string]string {
			return aws.GetEnvironmentVariablesFromS3(bucket, key)
		}
	}

	packageJSON := utils.LoadPackageJSON("")
	name := packageJSON.Name
	if strings.Contains(name, "lambda") {
		return func() map[string]string {
			return aws.GetLambdaEnvironmentVariables(name + "-testing")
		}
	}

	return func() map[string]string {
		return aws.GetEnvironmentVariablesFromS3(name+"-env", "testing.json")
	}
}

func printVars(vars []byte) {
	s := string(vars[:])
	fmt.Print(s)
}

func Env(c *cli.Context) {
	lambda := c.String("lambda")
	bucket := c.String("bucket")
	key := c.String("key")
	format := c.String("format")
	output := c.String("output")

	source := envSourceResolver(lambda, bucket, key)
	variables := source()

	var formatError error
	var formattedVariables []byte

	if format == "json" {
		formattedVariables, formatError = json.Marshal(variables)
	} else if format == "yml" {
		formattedVariables, formatError = utils.ConvertMapToYaml(variables)
	} else {
		log.Fatal("Please provide either 'yml' or 'json' as a format")
	}

	if formatError != nil {
		log.Fatal("Failed to convert variables to desired format")
	}

	if output == "" {
		printVars(formattedVariables)
	} else {
		ioutil.WriteFile(output, formattedVariables, 0644)
	}
}
