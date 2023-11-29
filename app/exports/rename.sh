find . -type f -name "*.PDF" -exec sh -c 'mv "$1" "${1%.PDF}.pdf"' _ {} \;
