package utils

import (
	"errors"
)

var shortNameMap = map[string]string{
	"choco":     "lambda-dazn-tube-choco-multiplier",
	"builder":   "lambda-dazn-tube-core-engine-builder",
	"optimizer": "lambda-dazn-tube-core-engine-optimizer",
	"deployer":  "lambda-dazn-tube-deployer",
	"uploader":  "lambda-dazn-tube-core-engine-uploader",
	"logger":    "lambda-dazn-tube-logger",
	"tracker":   "lambda-dazn-tube-journey-tracker",
	"manager":   "lambda-dazn-tube-template-manager",
}

func ResolveAppNames(app string, environments []string) []string {
	var appNames []string

	if app == "all" {
		for _, app := range shortNameMap {
			for _, env := range environments {
				appNames = append(appNames, app+"-"+env)
			}
		}
		return appNames
	}

	if app == "" {
		packageJson := LoadPackageJSON("")
		app = packageJson.Name
	} else if val, ok := shortNameMap[app]; ok {
		app = val
	}

	for _, env := range environments {
		appNames = append(appNames, app+"-"+env)
	}

	return appNames
}

func GetShortName(appName string) (error, string) {
	for shortName, fullName := range shortNameMap {
		if fullName == appName {
			return nil, shortName
		}
	}

	return errors.New("Did not find name " + appName), ""
}
