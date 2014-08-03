echo -e "Current Repo:$REPO --- Travis Branch:$TRAVIS_BRANCH"

# Create binary ZIP file
# Ignore all hidden files, .PSD, tests and requirements.txt files
zip -r plugin.video.dailytube4u.com-2.0.0.zip . -x '*.git*' '\.*' '*/\.*' '*.sh' '*.psd' 'resources/tests/*' '*.pyc' 'requirements.txt'