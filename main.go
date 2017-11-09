package main

import (
	"fmt"
	"go-cli/aws"
	"go-cli/utils"
	"io/ioutil"
	"os"

	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "dazn"
	app.Usage = "DAZN cli tools"
	app.Version = "0.1.0"
	app.Commands = []cli.Command{
		{
			Name: "tube",
			Subcommands: []cli.Command{
				{
					Name:  "build",
					Usage: "builds a package for deploying to AWS",
				},
				{
					Name:  "env",
					Usage: "gets local env vars from the test lambda, defaults to name from package.json",
					Flags: []cli.Flag{
						cli.StringFlag{
							Name:  "function, f",
							Usage: "get vars from function with name `FUNCTION`",
						},
					},
					Action: func(c *cli.Context) error {
						function := c.String("function")
						if c.String("function") == "" {
							packageJSON := utils.LoadPackageJSON("")
							function = packageJSON.Name + "-test"
						}

						variables := aws.GetLambdaEnvironmentVariables(function)
						yml, err := utils.ConvertMapToYaml(variables)
						if err != nil {
							fmt.Println("Failed to convert to yaml", err)
							return nil
						}

						ioutil.WriteFile("processEnv.yml", yml, 0644)
						return nil
					},
				},
				{
					Name:  "deploy",
					Usage: "deploys built package to AWS",
				},
			},
		},
	}

	app.Run(os.Args)
}
