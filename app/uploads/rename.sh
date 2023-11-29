rm *.png
find . -type f -name "*.jpeg" -exec sh -c 'mv "$1" "${1%.jpeg}.jpg"' _ {} \;
find . -type f -name "*.JPG" -exec sh -c 'mv "$1" "${1%.JPG}.jpg"' _ {} \;
