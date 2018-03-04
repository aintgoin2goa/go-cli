package commands

import (
	"fmt"
	"go-cli/aws"
	"go-cli/utils"

	"github.com/urfave/cli"
)

func Info(c *cli.Context) {
	app := c.String("app")
	environment := c.String("environment")

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

	for _, info := range infos {
		fmt.Print("=============================\n")
		fmt.Printf("%s\n", info.Name)
		fmt.Printf("%s\n", info.Description)
		fmt.Printf("%s:\t\t%s\n", "ARN", info.Arn)
		fmt.Printf("%s:\t%s\n", "Version", info.Version)
		fmt.Printf("%s:\t%dMB\n", "Package Size", info.CodePackageSize/1e6)
		fmt.Printf("%s:\t%s\n", "Handler", info.Handler)
		fmt.Print("=============================\n\n")
	}
}
