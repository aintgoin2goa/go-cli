#!/bin/bash
set -e

pythonScript='import sys; import json; obj = json.loads(sys.stdin.read()); print(",".join(list(map(lambda a: a["browser_download_url"], obj["assets"]))));'


assetsstr=$(curl https://api.github.com/repos/aintgoin2goa/go-cli/releases/latest | python3 -c "$pythonScript")

IFS=',' read -r -a assets <<< "$assetsstr"

os=$(uname | awk '{print tolower($0)}')

for asset in "${assets[@]}"
do : 
    if [[ $asset = *$os* ]]; then
        url=$asset
    fi
done

curl -L $url -o tube
mv ./tube /usr/local/bin/tube
chmod u+x /usr/local/bin/tube

echo "Installed!
tube --version
