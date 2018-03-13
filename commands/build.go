package commands

import (
	"archive/zip"
	"fmt"
	"go-cli/utils"
	"io"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/fatih/color"
	"github.com/urfave/cli"
)

func zipit(source, target string) error {
	zipfile, err := os.Create(target)
	if err != nil {
		return err
	}
	defer zipfile.Close()

	archive := zip.NewWriter(zipfile)
	defer archive.Close()

	info, err := os.Stat(source)
	if err != nil {
		return nil
	}

	var baseDir string
	if info.IsDir() {
		baseDir = filepath.Base(source)
	}

	filepath.Walk(source, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}

		if baseDir != "" {
			header.Name = filepath.Join(baseDir, strings.TrimPrefix(path, source))
		}

		if info.IsDir() {
			header.Name += "/"
		} else {
			header.Method = zip.Deflate
		}

		writer, err := archive.CreateHeader(header)
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()
		_, err = io.Copy(writer, file)
		return err
	})

	return err
}

func Build(c *cli.Context) {
	exlude := c.String("exclude")
	srcDir, _ := filepath.Abs(c.String("src"))
	tempDir, _ := filepath.Abs(c.String("temp"))
	outFile, _ := filepath.Abs(c.String("output"))
	currentDir, _ := os.Getwd()
	packageJsonFileName := "package.json"

	os.RemoveAll(tempDir)

	// packageJson, packageJsonError := utils.LoadPackageJSON("")
	// if packageJsonError != nil {
	// 	log.Fatal("Failed to load package.json - is there one in cwd?", packageJsonError)
	// }

	// /appName := packageJson.Name

	created, err := utils.CreateDirectory(tempDir)
	if !created {
		log.Fatal("Fatal to create temporary directory ", err)
	}

	fmt.Println("temp dir created - copying files")

	copyPackageJsonErr := utils.CopyFile(filepath.Join(currentDir, packageJsonFileName), filepath.Join(tempDir, packageJsonFileName))
	if copyPackageJsonErr != nil {
		os.RemoveAll(tempDir)
		log.Fatal("Failed to copy package.json", copyPackageJsonErr)
	}

	copySrcDirError := utils.CopyDirectory(srcDir, tempDir, true, exlude)
	if copySrcDirError != nil {
		os.RemoveAll(tempDir)
		log.Fatal("Failed to copy src folder", copySrcDirError)
	}

	os.Chdir(tempDir)
	fmt.Println("running yarn --production")
	_, npmErr := exec.Command("yarn", "--production").Output()
	if npmErr != nil {
		os.RemoveAll(tempDir)
		log.Fatal(npmErr)
	}

	fmt.Println("zipping up temp dir")
	_, zipErr := exec.Command("zip", "-r", outFile, ".").Output()
	if zipErr != nil {
		os.RemoveAll(tempDir)
		log.Fatal(zipErr)
	}

	os.RemoveAll(tempDir)
	color.Green("Deployment package created %s", outFile)

}
