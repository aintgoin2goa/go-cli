.PHONY: test

build:
	go build -o tube

test:
	go test -v ./...