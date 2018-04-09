.PHONY: test

install:
	pip3 install pipenv
	pipenv install

build:
	go build -o test/tube

build-all:
	gox -output="bin/tube_{{.OS}}_{{.Arch}}"  -os="darwin linux" -arch="amd64"

clean:
	rm -rf bin/
	rm test/tube

test:
	go test -v ./...

release: build-all
	python3 release.py