#!/bin/bash

if [ "$(cat /etc/os-release | grep 'NAME=\"Ubuntu\"')" ]; then
  sudo apt update
  sudo apt install -y \
build-essential \
libssl-dev \
zlib1g-dev \
libbz2-dev \
libreadline-dev \
libsqlite3-dev \
curl \
libncursesw5-dev \
xz-utils \
tk-dev \
libxml2-dev \
libxmlsec1-dev \
libffi-dev \
liblzma-dev
  if test "$(arch)" != "i386"; then
    echo "We cant use brew so installing stuff with apt and snap";
    sudo apt install -y \
awscli \
cargo \
silversearcher-ag \
pipx \
tree \
tmux

    sudo snap install --classic task;
    sudo snap install --classic go;
    sudo snap install taskwarrior-tui;
# xclip \


  fi
else
  echo "Not ubuntu, so not installing with apt-get"
fi

