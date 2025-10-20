cargo install --list | grep '^[a-z]' | cut -d' ' -f1 > "$DOTFILES/rust/Cargofile.txt"
