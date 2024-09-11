#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [[ "${TRACE-0}" == "1" ]]; then
    set -o xtrace
fi

# install node if not available
source ~/.nvm/nvm.sh
nvm use || nvm install $(cat .nvmrc)

# install packages
rm -rf node_modules
nvm use
npm install
npx playwright install