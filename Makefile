.PHONY: test

install:
	pip3 install pipenv
	pipenv install

build:
	go build -o tube

build-all:
	gox -output="bin/tube_{{.OS}}_{{.Arch}}"  -os="darwin" -arch="amd64"

clean:
	rm -rf bin/
	rm tube

test:
	go test -v ./...

release: build-all
	python3 release.py