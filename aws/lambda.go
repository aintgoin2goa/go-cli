package aws

import (
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
)

var region = "eu-west-2"

type FunctionInfo struct {
	Name            string
	Arn             string
	Description     string
	CodePackageSize int64
	Version         string
	Handler         string
	LastModified    time.Time
}

// GetLambdaEnvironmentVariables - pretty self explanatory
func GetLambdaEnvironmentVariables(functionName string) map[string]string {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create Lambda service client
	svc := lambda.New(sess, &aws.Config{Region: aws.String(region)})
	input := &lambda.GetFunctionConfigurationInput{
		FunctionName: aws.String(functionName),
	}

	result, err := svc.GetFunctionConfiguration(input)

	vars := make(map[string]string)

	if err != nil {
		fmt.Println(err)
		return vars
	}

	for key, value := range result.Environment.Variables {
		vars[key] = *value
	}

	return vars
}

func GetFunctionInfo(functionName string) FunctionInfo {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create Lambda service client
	svc := lambda.New(sess, &aws.Config{Region: aws.String(region)})

	getFuncInput := &lambda.GetFunctionInput{
		FunctionName: aws.String(functionName),
	}

	getConfigInput := &lambda.GetFunctionConfigurationInput{
		FunctionName: aws.String(functionName),
	}

	getFuncResult, err1 := svc.GetFunction(getFuncInput)
	config, err2 := svc.GetFunctionConfiguration(getConfigInput)

	if err1 != nil {
		log.Fatal(err1)
	}

	if err2 != nil {
		log.Fatal(err2)
	}

	info := FunctionInfo{
		Name:            *getFuncResult.Configuration.FunctionName,
		Arn:             *getFuncResult.Configuration.FunctionArn,
		Description:     *getFuncResult.Configuration.Description,
		Version:         *getFuncResult.Tags["Version"],
		CodePackageSize: *config.CodeSize,
		Handler:         *config.Handler,
	}

	return info
}
