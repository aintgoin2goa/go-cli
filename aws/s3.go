package aws

import (
	"encoding/json"
	"fmt"
	"go-cli/utils"
	"io/ioutil"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

// GetEnvironmentVariablesFromS3 Gets environment variables stored as json on an s3 bucket
func GetEnvironmentVariablesFromS3(bucket, key string) map[string]string {
	session := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))
	s3Client := s3.New(session, &aws.Config{Region: aws.String("eu-west-1")})

	file := utils.CreateFile("env.json", "")
	object := &s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	}
	downloader := s3manager.NewDownloaderWithClient(s3Client)
	_, downloadErr := downloader.Download(file, object)

	if downloadErr != nil {
		fmt.Printf("Failed to download %s from %s: %v \n", key, bucket, downloadErr)
		os.Exit(1)
	}

	data, readErr := ioutil.ReadFile(file.Name())

	if readErr != nil {
		fmt.Printf("Failed to read downloaded json: %v \n", readErr)
		os.Exit(1)
	}

	var envMap map[string]string
	jsonErr := json.Unmarshal(data, &envMap)
	if jsonErr != nil {
		fmt.Printf("Failed to parse json file %v \n", jsonErr)
	}

	return envMap
}
