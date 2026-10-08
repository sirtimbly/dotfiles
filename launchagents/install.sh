#!/bin/sh
#
# Install the LaunchAgents in this directory and (re)load them.
# Plists are copied rather than symlinked; launchd is unreliable with symlinks.

if test ! "$(uname)" = "Darwin"
  then
  exit 0
fi

src_dir="$(cd "$(dirname "$0")" && pwd)"
dest_dir="$HOME/Library/LaunchAgents"
mkdir -p "$dest_dir"

for plist in "$src_dir"/*.plist; do
  label="$(basename "$plist" .plist)"
  echo "› installing LaunchAgent $label"
  cp "$plist" "$dest_dir/"
  launchctl bootout "gui/$(id -u)/$label" 2>/dev/null
  launchctl bootstrap "gui/$(id -u)" "$dest_dir/$label.plist"
done
