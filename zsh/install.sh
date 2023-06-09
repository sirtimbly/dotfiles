echo "Checking if Oh-my-zsh is installed."
if ! test -d ~/.oh-my-zsh
then
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc
fi

exit 0

