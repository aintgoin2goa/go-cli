import subprocess
import requests
import os
import sys
import json

github_api_base = "https://api.github.com"

github_api_token = os.environ['GITHUB_TOKEN']
github_user = "aintgoin2goa"
releases_path = '/repos/aintgoin2goa/go-cli/releases'

def fail(message):
    print(message)
    sys.exit(1)

def success(message):
    print(message)
    sys.exit(0)

def github_api_get(path):
    url = github_api_base + path
    response = requests.get(url, auth=(github_user, github_api_token))
    return response.json()

def github_api_post(path, payload, headers = None):
    url = github_api_base + path
    response = requests.post(url, data=payload, auth=(github_user, github_api_token), headers=headers)
    response.raise_for_status()
    return response.json()
    

def get_releases():
    release_data = github_api_get(releases_path)
    return list(map(lambda item : item.get('tag_name'), release_data))

def create_release(version):
    data = {
        "tag_name": version,
        "target_commitish": "master",
        "name": version,
        "body": version,
        "draft": False,
        "prerelease": ('-' in version)
    }
    return github_api_post(releases_path, json.dumps(data))

def get_app_version():
    result = subprocess.run(["./bin/tube_darwin_amd64", "-v"], stdout=subprocess.PIPE, encoding="utf8")
    versionOutput = str(result.stdout).split()
    version = 'v' + versionOutput[2]
    return version

def upload_release_asset(upload_url, name):
    url = upload_url.replace('{?name,label}', '?name=' + name)
    with open("./bin/" + name, 'rb') as f:
        file = f.read()
    headers = {'Content-Type' : 'application/octet-stream'}
    response = requests.post(url, auth=(github_user, github_api_token), headers=headers, data=file)
    response.raise_for_status()
    return response.json()




version = get_app_version()
releases = get_releases()
assets = os.listdir('./bin')


if version in releases:
    fail("Version " + version + " already exists, update value in main.go")

release = create_release(version)

upload_url = str(release.get('upload_url'))
print("created new release.")
print("assets to upload:")
print(assets)

for asset in assets:
    upload_response = upload_release_asset(upload_url, asset)
    print(asset + " uploaded")
    print(upload_response)

success("version " + version + " released!")