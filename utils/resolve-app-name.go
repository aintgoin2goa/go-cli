package utils

var shortNameMap = map[string]string{
	"choco":     "lambda-dazn-tube-choco-multiplier",
	"builder":   "lambda-dazn-tube-core-engine-builder",
	"optimizer": "lambda-dazn-tube-core-engine-optimizer",
	"uploader":  "lambda-dazn-tube-core-engine-uploader",
	"logger":    "lambda-dazn-tube-logger",
	"tracker":   "lambda-dazn-tube-journey-tracker",
	"manager":   "lambda-dazn-tube-template-manager",
}

func ResolveAppNames(app string, environments []string) []string {
	if app == "" {
		packageJson := LoadPackageJSON("")
		app = packageJson.Name
	} else if val, ok := shortNameMap[app]; ok {
		app = val
	}

	var appNames []string

	for _, env := range environments {
		appNames = append(appNames, app+"-"+env)
	}

	return appNames
}
