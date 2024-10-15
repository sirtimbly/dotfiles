echo "Checking if asdf is installed."
if ! test -d ~/.asdf
then
  sh -c "$(git clone https://github.com/asdf-vm/asdf.git --depth 1 --branch v0.14.0 --single-branch ~/.asdf)" "" --keep-zshrc
  . "$HOME/.asdf/asdf.sh"
fi
echo "Checking for asdf plugins."
PLUGINS=$(cat "$HOME/.tool-versions" | cut -d" " -f1);
for PLUGIN in $PLUGINS; do
  echo "Adding plugin $PLUGIN";
  asdf plugin add "$PLUGIN";
  status=$?;
  if [ $status -ne 0 ] && [ $status -ne 2 ]; then
    echo "Install failed with status $status";
    exit $status;
  elif [ $status -eq 2 ]; then
    echo "Install returned status 2, continuing...";
  else
    echo "Install succeeded";
  fi;
done
asdf install
exit 0
