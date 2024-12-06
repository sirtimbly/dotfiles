echo "Checking if Oh-my-zsh is installed."
if ! test -d ~/.oh-my-zsh
then
  sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --keep-zshrc
fi


echo "Setting up Atuin"
curl --proto '=https' --tlsv1.2 -LsSf https://setup.atuin.sh | sh

exit 0

