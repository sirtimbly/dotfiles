export PATH="/Users/timbendt/.local/bin:$PATH"
if (( $+commands[brew] ))
then
  export PATH="$(brew --prefix)/opt/python@3.9/libexec/bin:$PATH"
fi
