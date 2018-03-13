package utils

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"path/filepath"
)

// PackageJSON representation of the package.json file
type PackageJSON struct {
	Name    string
	Version string
}

// LoadPackageJSON loads the package.json file as a string
func LoadPackageJSON(basePath string) (PackageJSON, error) {
	if basePath == "" {
		basePath, _ = os.Getwd()
	}

	joinedPath := filepath.Join(basePath, "./package.json")
	packageJSONPath, _ := filepath.Abs(joinedPath)
	packageJSONFileContents, err := ioutil.ReadFile(packageJSONPath)
	if err != nil {
		return PackageJSON{}, err
	}

	return decodePackageJSON(packageJSONFileContents), nil
}

func decodePackageJSON(packageJSONContents []byte) PackageJSON {
	pkg := PackageJSON{}
	json.Unmarshal(packageJSONContents, &pkg)
	return pkg
}
