#!/bin/sh

# Get the MIME type of the file
MIME_TYPE=$(file --mime-type -b "$1")

# Check if it's a text file
if echo "$MIME_TYPE" | grep -q "^text/"; then
    hx "$1"
    # If hx is a blocking editor, you might want to uncomment the following line
    # to refresh nnn after editing, though nnn often handles this
    # exit 0
else
    # For other file types, fallback to the system default opener
    # On Linux:
    xdg-open "$1"
    # On macOS:
    # open "$1"
    # Adjust based on your OS
fi
