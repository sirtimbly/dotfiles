echo "Checking if asdf is installed."
if ! test -d ~/.asdf
then
  sh -c "$(git clone https://github.com/asdf-vm/asdf.git ~/.asdf)" "" --keep-zshrc
  . "$HOME/.asdf/asdf.sh"
fi
echo "Checking for asdf nodejs plugin."
if ! test -d ~/.asdf/plugins/nodejs
then
  asdf plugin add nodejs
  asdf install nodejs
  asdf install nodejs latest
fi
echo "Checking for asdf pnpm plugin."
if ! test -d ~/.asdf/plugins/pnpm
then
  asdf plugin add pnpm
  asdf install pnpm latest
fi
exit 0
