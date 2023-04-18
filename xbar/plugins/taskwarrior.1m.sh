#!/bin/bash
#
# Taskwarrior
#
# <xbar.title>Taskwarrior</xbar.title>
# <xbar.version>v1.0</xbar.version>
# <xbar.author>Tim Bendt</xbar.author>
# <xbar.author.github>sirtimbly</xbar.author.github>
# <xbar.desc>Task managment through your menu-bar.</xbar.desc>
# <xbar.dependencies>task,sh</xbar.dependencies>
# <xbar.image></xbar.image>
#
# Dependencies:
#   taskwarrior (http://taskwarrior.org)
#      available via homebrew `brew install task`


# COUNT=$(echo $TASK_READY | sed '$!d')
COUNT=$(/usr/local/bin/task +READY count)
echo "☑️ $COUNT"
echo "---"
/usr/local/bin/task minimal | tail -n +4
