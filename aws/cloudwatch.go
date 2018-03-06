package aws

import (
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cloudwatchlogs"
)

type LogEntry struct {
	Timestamp time.Time
	Message   string
}

type LogResult struct {
	Stream string
	Logs   []LogEntry
}

func GetLogStreamsForLambda(functionName string) ([]string, error) {
	logGroupPrefix := "/aws/lambda/"
	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := cloudwatchlogs.New(sess, aws.NewConfig().WithRegion(region))
	input := &cloudwatchlogs.DescribeLogStreamsInput{
		LogGroupName: aws.String(logGroupPrefix + functionName),
		Descending:   aws.Bool(true),
		OrderBy:      aws.String("LastEventTime"),
	}

	result, error := svc.DescribeLogStreams(input)

	if error != nil {
		return nil, error
	}

	var streamNames []string

	for _, stream := range result.LogStreams {
		streamNames = append(streamNames, *stream.LogStreamName)
	}

	return streamNames, nil
}

func GetLogsForStream(functionName string, streamName string) ([]LogEntry, error) {
	logGroupPrefix := "/aws/lambda/"

	sess := session.Must(session.NewSessionWithOptions(session.Options{
		SharedConfigState: session.SharedConfigEnable,
	}))

	svc := cloudwatchlogs.New(sess, aws.NewConfig().WithRegion(region))
	input := &cloudwatchlogs.GetLogEventsInput{
		LogGroupName:  aws.String(logGroupPrefix + functionName),
		LogStreamName: aws.String(streamName),
	}

	result, error := svc.GetLogEvents(input)

	if error != nil {
		return nil, error
	}

	var logs []LogEntry

	for _, logEvent := range result.Events {
		time := time.Unix(*logEvent.Timestamp/1000, 0)
		msg := *logEvent.Message
		if !strings.HasSuffix(msg, "\n") {
			msg = msg + "\n"
		}
		log := LogEntry{Message: msg, Timestamp: time}
		logs = append(logs, log)
	}

	return logs, nil
}

func GetLogs(functionName string) (LogResult, error) {
	streams, err := GetLogStreamsForLambda(functionName)
	var result LogResult
	if err != nil {
		return result, err
	}
	stream := streams[0]
	logs, err := GetLogsForStream(functionName, stream)
	if err != nil {
		return result, err
	}

	result.Stream = stream
	result.Logs = logs
	return result, nil
}
