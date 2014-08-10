#!/bin/bash
echo -e "Current Repo:$REPO --- Travis Branch:$TRAVIS_BRANCH"

# TODO: Extract version from addon.xml

echo "Debugging messages..."
echo "\$REPO" $REPO
echo "\$REPO.git" $REPO.git
git remote -v

# Ignore all hidden files, .PSD, tests, node_modules and requirements.txt files
echo "Creating XBMC plugin zip file"
zip -r "plugin.video.dailytube4u.com-${TRAVIS_BRANCH}.zip" . -x '*.git*' '\.*' '*/\.*' '*.sh' '*.psd' 'resources/tests/*' '*.pyc' 'requirements.txt' 'node_modules/*'