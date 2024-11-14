noglob find . -type f -name "[0-9][0-9]*" -exec sh -c '
  new_name=$(echo "$1" | sed -E "s/^\.\/[0-9]{2}-(.*)/\1/")
  mv "$1" "$new_name"
' sh {} \;
