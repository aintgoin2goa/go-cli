package main

import (
	"go-cli/commands"
	"os"

	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "tube"
	app.Usage = "DAZN Tube cli tools"
	app.Version = "0.3.1"

	app.Commands = []cli.Command{
		{
			Name:      "env",
			Usage:     "Gets env var from a lambda function configuration or S3 bucket. Writes result in given format to stdout",
			UsageText: "If no lambda or bucket given, will attempt to read the package.json and guess",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "lambda, l",
					Value: "",
					Usage: "get vars from function with name `FUNCTION`",
				},
				cli.StringFlag{
					Name:  "bucket, b",
					Value: "",
					Usage: "get vars from S3 bucket named `BUCKET`",
				},
				cli.StringFlag{
					Name:  "key, k",
					Value: "",
					Usage: "key to use when retrieving from a bucket",
				},
				cli.StringFlag{
					Name:  "format, f",
					Value: "yml",
					Usage: "'yml' or 'json'",
				},
				cli.StringFlag{
					Name:  "output, o",
					Value: "",
					Usage: "file to write to, will write to stdout if not given",
				},
			},
			Action: commands.Env,
		},
		{
			Name:  "info",
			Usage: "get info about a running lambda",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "app, a",
					Value: "",
					Usage: "full name of lambda without environment suffix, or shortname",
				},
				cli.StringFlag{
					Name:  "environment, e",
					Value: "production",
					Usage: "comma-seperated list of environment suffixes",
				},
				cli.BoolFlag{
					Name:  "arn",
					Usage: "display only the arn",
				},
				cli.BoolFlag{
					Name:  "version",
					Usage: "display only the version",
				},
				cli.BoolFlag{
					Name:  "name",
					Usage: "display only the function name",
				},
				cli.BoolFlag{
					Name:  "terraform, t",
					Usage: "prints out the version, in the format used for terraform",
				},
			},
			Action: commands.Info,
		},
		{
			Name:  "logs",
			Usage: "Gets logs for the last invocation of a lambda",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "app, a",
					Value: "",
					Usage: "full name of a lambda, or shortname",
				},
				cli.StringFlag{
					Name:  "environment, e",
					Value: "production",
					Usage: "environment to get logs for",
				},
				cli.StringFlag{
					Name:  "page, p",
					Value: "1",
					Usage: "Page of logs to get (1 - most recent, 2 - next most recent etc)",
				},
			},
			Action: commands.Logs,
		},
		{
			Name:  "build",
			Usage: "builds an artifact from local src, enabling manual deployments for testing purposes",
			Flags: []cli.Flag{
				cli.StringFlag{
					Name:  "src",
					Usage: "name of the directory containing source code",
					Value: "src",
				},
				cli.StringFlag{
					Name:  "temp",
					Usage: "name of the temporary directory",
					Value: "temp",
				},
				cli.StringFlag{
					Name:  "output, o",
					Usage: "name of the output file",
					Value: "deploymentPackage.zip",
				},
				cli.StringFlag{
					Name:  "exclude, x",
					Usage: "exclude files matching this pattern",
					Value: ".test.js",
				},
			},
			Action: commands.Build,
		},
	}

	app.Run(os.Args)
}
