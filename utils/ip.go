package utils

import (
	"io/ioutil"
	"net/http"
)

func GetCurrentIP() (string, error) {
	res, err := http.Get("https://api.ipify.org/")
	if err != nil {
		return "", err
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	return string(body[:]), nil
}
