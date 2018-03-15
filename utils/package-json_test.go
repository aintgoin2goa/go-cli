package utils

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadPackageJson(t *testing.T) {
	workingDir, _ := os.Getwd()
	basePath := filepath.Join(workingDir, "../")
	expectedName := "dazn-team-frontend-lambda-tube-core-engine-builder"
	expectedVersion := "1.0.0"

	result, _ := LoadPackageJSON(basePath)

	if result.Name != expectedName {
		t.Error("expected name to be test-package-name.  Found: " + result.Name)
	}
	if result.Version != expectedVersion {
		t.Error("expected version to be 1.0.0.  Found: " + result.Version)
	}
}
