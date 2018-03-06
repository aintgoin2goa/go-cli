package commands

import (
	"fmt"
	"go-cli/aws"
	"go-cli/utils"
	"log"

	"github.com/fatih/color"
	"github.com/urfave/cli"
)

func Logs(c *cli.Context) {
	app := c.String("app")
	environment := []string{c.String("environment")}
	seperator := "=================================================================================================="

	appNames := utils.ResolveAppNames(app, environment)
	functionName := appNames[0]
	logResult, err := aws.GetLogs(functionName)
	if err != nil {
		log.Fatal(err)
	}

	green := color.New(color.FgGreen).SprintfFunc()
	white := color.New(color.FgWhite).SprintfFunc()

	color.Cyan(seperator)
	fmt.Printf("%s\t\t\t%s\n", green("FUNCTION"), white(functionName))
	fmt.Printf("%s\t\t\t\t%s\n", green("STREAM"), white(logResult.Stream))
	fmt.Println("   ")
	for _, log := range logResult.Logs {
		time := green(log.Timestamp.String())
		msg := white(log.Message)
		fmt.Printf("%s\t%s", time, msg)
	}
	color.Cyan(seperator)
}
