package utils

import (
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
)

func CreateDirectory(path string) (bool, error) {
	err := os.Mkdir(path, 0755)
	success := (err == nil)
	return success, err
}

func CreateFile(name, path string) *os.File {
	if path == "" {
		path, _ = os.Getwd()
	}

	fullPath := filepath.Join(path, name)
	file, err := os.Create(fullPath)
	if err != nil {
		fmt.Printf("failed to create file %v %v", file, err)
		os.Exit(1)
	}

	return file
}

func PathExists(path string) bool {
	_, err := os.Stat(path)

	if err == nil {
		return true
	}

	if os.IsNotExist(err) {
		return false
	}

	return true
}

func CopyFile(srcFilePath, destFilePath string) error {
	stats, statsError := os.Stat(srcFilePath)
	if statsError != nil {
		return statsError
	}

	src, srcError := os.Open(srcFilePath)
	if srcError != nil {
		return srcError
	}
	os.Chmod(src.Name(), stats.Mode())

	dest, destError := os.Create(destFilePath)
	if destError != nil {
		return destError
	}

	_, copyError := io.Copy(dest, src)
	if copyError != nil {
		return copyError
	}

	src.Close()
	dest.Close()

	return nil
}

func CopyDirectory(srcDirPath, destDirPath string, recursive bool, excludePattern string) error {
	stats, statsError := os.Stat(srcDirPath)
	if statsError != nil {
		return statsError
	}

	mkdirError := os.MkdirAll(destDirPath, stats.Mode())
	if mkdirError != nil {
		return mkdirError
	}

	infos, readDirError := ioutil.ReadDir(srcDirPath)
	if readDirError != nil {
		return readDirError
	}

	for _, info := range infos {
		name := info.Name()
		src := filepath.Join(srcDirPath, name)
		dest := filepath.Join(destDirPath, name)
		if info.IsDir() {
			if recursive {
				CopyDirectory(src, dest, recursive, excludePattern)
			}
		} else if excludePattern != "" {
			match, _ := regexp.MatchString(excludePattern, src)
			if !match {
				CopyFile(src, dest)
			}
		} else {
			CopyFile(src, dest)
		}
	}

	return nil
}
