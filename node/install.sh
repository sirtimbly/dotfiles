# Install NVM
if  ! test -d ~/.nvm
then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

# Global Installs
npm i -g http-server http-server-spa hexo commitizen typescript npkill

exit 0
