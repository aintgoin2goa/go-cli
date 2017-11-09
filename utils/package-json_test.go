package utils

import (
	"path/filepath"
	"testing"
)

func TestLoadPackageJson(t *testing.T) {
	basePath, _ := filepath.Abs("../stubs/")
	result := LoadPackageJSON(basePath)
	if result.Name == "test-package-name" {
		t.Error("package.json file did not match expected contents")
	}
}
