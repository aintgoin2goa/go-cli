package aws

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
)

// GetLambdaEnvironmentVariables - pretty self explanatory
func GetLambdaEnvironmentVariables(functionName string) map[string]string {
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	// Create Lambda service client
	svc := lambda.New(sess, &aws.Config{Region: aws.String("eu-west-2")})
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
