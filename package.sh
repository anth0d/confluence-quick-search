#!/usr/bin/env bash
set -e

if ! [[ -x "$(command -v jq)" ]]; then
  echo "jq is not installed. try running 'brew install jq'"
  echo "exiting..."
  echo ""
  exit 1
fi

PKG_V=$(cat package.json | jq -r .version)
MAN_V=$(cat public/manifest.json | jq -r .version)
if [[ $PKG_V != $MAN_V ]]; then
  echo "package and manifest versions do not match: $PKG_V != $MAN_V"
  echo ""
  exit 1
fi

npm run clean
npm run lint
npm run test
npm run build

# cd dist/
# INLINE_RUNTIME_CHUNK=false npm run rsbuild
# cd build/
# BACKGROUND_JS="$(find static -type f -iname "3.*.js" | tr -d '\n')"
# sed -i '' -e "s#static/js/background.js#${BACKGROUND_JS}#g" manifest.json

PACKAGE="chrome-confluence-search-${MAN_V}"

cd dist/
zip -vr "${PACKAGE}.zip" . -x *.DS_Store

echo ""
echo "dist/${PACKAGE}.zip"
echo ""
