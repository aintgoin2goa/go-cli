package commands

import (
	"bufio"
	"fmt"
	"go-cli/aws"
	"go-cli/utils"
	"log"
	"os"
	"strconv"

	"github.com/fatih/color"
	"github.com/urfave/cli"
)

func printLogs(logs []aws.LogEntry, stream string, functionName string) {
	seperator := "=================================================================================================="
	green := color.New(color.FgGreen).SprintfFunc()
	white := color.New(color.FgWhite).SprintfFunc()

	color.Cyan(seperator)
	fmt.Printf("%s\t\t\t%s\n", green("FUNCTION"), white(functionName))
	fmt.Printf("%s\t\t\t\t%s\n", green("STREAM"), white(stream))
	fmt.Println("   ")
	for _, log := range logs {
		time := green(log.Timestamp.String())
		msg := white(log.Message)
		fmt.Printf("%s\t%s", time, msg)
	}
	color.Cyan(seperator)
}

func Logs(c *cli.Context) {
	app := c.String("app")
	environment := []string{c.String("environment")}
	page, _ := strconv.Atoi(c.String("page"))
	interactive := c.Bool("interactive")

	appNames := utils.ResolveAppNames(app, environment)
	functionName := appNames[0]
	logResult, err := aws.GetLogs(functionName, page)
	if err != nil {
		log.Fatal(err)
	}

	printLogs(logResult.Logs, logResult.Stream, functionName)

	if interactive {
		scanner := bufio.NewScanner(os.Stdin)
		var options = []string
		if !logResult.IsFirstPage {
			options = append(options, "[P] Previous page")
		}

		if !logResult.IsLastPage {
			options = append(options, "[N]")
		}
	}
}
