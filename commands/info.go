package commands

import (
	"fmt"
	"go-cli/aws"
	"go-cli/utils"

	"github.com/urfave/cli"
)

func printSingleValue(value string, isAll bool, appName string) {
	if isAll && appName != value {
		fmt.Printf("%s=%s\n", appName, value)
	} else {
		fmt.Printf("%s\n", value)
	}
}

func printAllValues(info aws.FunctionInfo) {
	fmt.Print("=============================\n")
	fmt.Printf("%s\n", info.Name)
	fmt.Printf("%s\n", info.Description)
	fmt.Printf("%s:\t\t%s\n", "ARN", info.Arn)
	fmt.Printf("%s:\t%s\n", "Version", info.Version)
	fmt.Printf("%s:\t%dMB\n", "Package Size", info.CodePackageSize/1e6)
	fmt.Printf("%s:\t%s\n", "Handler", info.Handler)
	fmt.Print("=============================\n\n")
}

func Info(c *cli.Context) {
	app := c.String("app")
	environment := c.String("environment")
	arn := c.Bool("arn")
	version := c.Bool("version")
	name := c.Bool("name")

	var environments []string
	allEnvironments := []string{"testing", "staging", "production"}

	if environment == "all" {
		environments = allEnvironments
	} else {
		environments = append(environments, environment)
	}

	appNames := utils.ResolveAppNames(app, environments)
	infos := []aws.FunctionInfo{}

	for _, name := range appNames {
		infos = append(infos, aws.GetFunctionInfo(name))
	}

	isAll := (app == "all" || environment == "all")

	for index, info := range infos {
		currentApp := appNames[index]
		if arn == true {
			printSingleValue(info.Arn, isAll, currentApp)
		} else if version == true {
			printSingleValue(info.Version, isAll, currentApp)
		} else if name == true {
			printSingleValue(info.Name, isAll, currentApp)
		} else {
			printAllValues(info)
		}
	}
}
