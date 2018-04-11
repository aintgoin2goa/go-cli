package commands

import (
	"go-cli/aws"
	"go-cli/utils"
	"log"
	"os"
	"strconv"

	"github.com/fatih/color"
	"github.com/urfave/cli"
)

var serviceToSecurityGroup = map[string]string{
	"jenkins":     "sg-56b8c42f",
	"artifactory": "sg-d9bec2a0",
}

func Allow(c *cli.Context) {
	clean := c.Bool("clean")
	jenkins := c.Bool("jenkins")
	artifactory := c.Bool("artifactory")
	ip := c.String("ip")
	protocol := c.String("protocol")
	region := c.String("region")
	name := c.String("name")

	if !clean && name == "" {
		color.Red("Please provide a name using --name or -n")
		os.Exit(1)
	}

	var expiry int
	if e, err := strconv.Atoi(c.String("expiry")); err != nil {
		log.Fatal(err)
	} else {
		expiry = e
	}

	if ip == "current" {
		if currentIp, ipError := utils.GetCurrentIP(); ipError != nil {
			log.Fatal(ipError)
		} else {
			ip = currentIp
		}
	}

	var securityGroups []string
	if jenkins {
		jenkinsGroup, _ := serviceToSecurityGroup["jenkins"]
		securityGroups = append(securityGroups, jenkinsGroup)
	}

	if artifactory {
		artifactoryGroup, _ := serviceToSecurityGroup["artifactory"]
		securityGroups = append(securityGroups, artifactoryGroup)
	}

	for _, group := range securityGroups {
		if clean {
			if cleanResult, err := aws.CleanOldIngressRules(group, region); err != nil {
				color.Red("Failed to clean old rules from group %s\n", group)
			} else {
				color.Yellow("Removed %d expired ips from group %s\n", cleanResult.RemovedCount, group)
			}
		} else {
			if err := aws.AddIngressIp(group, region, protocol, ip, name, expiry); err != nil {
				log.Fatal(err)
			} else {
				color.Green("Added ip %s  to security group %s\n", ip, group)
			}
		}
	}

	color.Green("Finished!")
}
