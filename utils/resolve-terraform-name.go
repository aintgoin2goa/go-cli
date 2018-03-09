package utils

import (
	"errors"
)

var nameMap = map[string]string{
	"choco":     "choco_version",
	"builder":   "builder_version",
	"optimizer": "optimizer_version",
	"deployer":  "deployer_version",
	"uploader":  "uploader_version",
	"logger":    "logger_version",
	"tracker":   "journey_tracker_version",
	"manager":   "template_manager_version",
}

func ResolveTerraformName(name string) (error, string) {
	tName, inMap := nameMap[name]
	if inMap {
		return nil, tName
	}

	err, shortName := GetShortName(name)
	if err != nil {
		return err, ""
	}

	tName2, inMap2 := nameMap[shortName]
	if inMap2 {
		return nil, tName2
	} else {
		return errors.New("Invalid app name"), ""
	}
}
