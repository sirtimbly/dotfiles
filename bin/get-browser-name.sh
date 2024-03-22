#!/usr/bin/env bash

browser=$(lsappinfo metainfo | grep -E -o 'Safari|Google Chrome' | head -1)
[[ "$browser" = "Safari" ]] && syntax="current" || syntax="active"


echo { \"appname\": \"$browser\", \"syntax\": \"$syntax\" }
