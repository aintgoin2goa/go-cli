package utils

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

func TestCreateDirectory(t *testing.T) {
	path, _ := os.Getwd()
	dirName := "random-test-dir"
	expectedPath := filepath.Join(path, dirName)
	CreateDirectory(expectedPath)
	directoryWasCreated := PathExists(expectedPath)

	if directoryWasCreated {
		os.Remove(expectedPath)
	} else {
		t.Error("Directory was not created")
	}
}

func TestFileCopy(t *testing.T) {
	cwd, _ := os.Getwd()
	testFilePath := filepath.Join(cwd, "file")
	newFilePath := filepath.Join(cwd, "newfile")
	os.Create(testFilePath)
	err := CopyFile(testFilePath, newFilePath)
	fileWasCopied := PathExists(newFilePath)
	defer os.Remove(testFilePath)
	defer os.Remove(newFilePath)

	if err != nil {
		fmt.Println(err)
		t.Error("Failed to copy")
	}

	if !fileWasCopied {
		t.Error("File was not copied")
	}
}

func TestDirectoryCopy(t *testing.T) {
	cwd, _ := os.Getwd()
	testFolderPath := filepath.Join(cwd, "folder")
	newFolderPath := filepath.Join(cwd, "newfolder")
	newSubFolderPath := filepath.Join(newFolderPath, "subfolder")
	os.MkdirAll(testFolderPath, 0755)
	err := CopyDirectory(testFolderPath, newSubFolderPath, false, "")
	fileWasCopied := PathExists(newFolderPath)
	defer os.Remove(testFolderPath)
	defer os.Remove(newSubFolderPath)

	if err != nil {
		fmt.Println(err)
		t.Error("Failed to copy")
	}

	if !fileWasCopied {
		t.Error("File was not copied")
	}
}

func TestRecursiveCopy(t *testing.T) {
	cwd, _ := os.Getwd()
	basePath := filepath.Dir(cwd)
	testPackagePath := filepath.Join(basePath, "test", "package")
	resultPath := filepath.Join(basePath, "test", "result")
	err := CopyDirectory(testPackagePath, resultPath, true, "")
	fileWasCopied := PathExists(resultPath)

	if err != nil {
		fmt.Println(err)
		t.Error("Failed to copy")
	}

	if !fileWasCopied {
		t.Error("File was not copied")
	}
}
