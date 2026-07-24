
if ! test -d ~/.asdf
then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
fi

echo "install tools from CARGO"
cargo install cargo-binstall
xargs -L 1 cargo binstall < "$DOTFILES/rust/Cargofile.txt"
echo "install bat from cargo"
cargo install bat

echo "pimalaya"
cargo install --locked --git https://github.com/pimalaya/neverest.git
cargo install --locked --git https://github.com/pimalaya/comodoro.git
cargo install himalaya
