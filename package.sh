#!/usr/bin/env bash
set -e

if ! [[ -x "$(command -v jq)" ]]; then
  echo "jq is not installed. try running 'brew install jq'"
  echo "exiting..."
  echo ""
  exit 1
fi

PACKAGE_PREFIX="confluence-quick-search"
PKG_V=$(cat package.json | jq -r .version)

npm install
npm run clean
npm run lint
npm run test
rm confluence-quick-search*.zip
zip -vr "${PACKAGE_PREFIX}_source_${PKG_V}.zip" "." -x *.DS_Store -x ".git/*" -x "./node_modules/*"

for PLATFORM in chrome firefox; do
  npm run clean
  npm run build:$PLATFORM

  # cd dist/
  # INLINE_RUNTIME_CHUNK=false npm run rsbuild
  # cd build/
  # BACKGROUND_JS="$(find static -type f -iname "3.*.js" | tr -d '\n')"
  # sed -i '' -e "s#static/js/background.js#${BACKGROUND_JS}#g" manifest.json

  MAN_V=$(cat dist/manifest.json | jq -r .version)
  if [[ $PKG_V != $MAN_V ]]; then
    echo "package and manifest versions do not match: $PKG_V != $MAN_V"
    echo ""
    exit 1
  fi
  PACKAGE="${PACKAGE_PREFIX}_${PLATFORM}_${MAN_V}"

  cd dist/
  zip -vr "${PACKAGE}.zip" "." -x *.DS_Store
  cd ..
  mv "dist/${PACKAGE}.zip" "."

  echo ""
  echo "dist/${PACKAGE}.zip"
  echo ""
done
