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
	app.Version = "0.1.0"

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
			},
			Action: commands.Info,
		},
	}

	app.Run(os.Args)
}
