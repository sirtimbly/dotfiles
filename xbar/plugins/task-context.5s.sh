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
# FILTER="+PENDING and +READY and (+DUE or +OVERDUE)"
#^Context '(.+)'
#'1!d;s/^Context\W.//;s/.\Wwith//'
CURRENT=$(/usr/local/bin/task context show | sed '1!d;s/^Context..//;s/..with//')
CONTEXTS=$(/usr/local/bin/task _context)
echo "☑️ $CURRENT"
echo "---"

echo "-none- | shell='/usr/local/bin/task' param1='context' param2='none' terminal=false refresh=true"
while IFS= read -r line; do
    echo "$line | shell='/usr/local/bin/task' param1='context' param2='$line' terminal=false refresh=true"
done <<< "$CONTEXTS"
# echo $CONTEXTS
# CTX_INDEX=0
# while [ $CTX_INDEX -lt ${#CONTEXTS[@]} ]; do
#     NEXT_CTX="${CONTEXTS[$CTX_INDEX]}"
#     echo "$NEXT_CONTEXT | shell='/usr/local/bin/task' arg1='context' arg3='$NEXT_CONTEXT' "
#     CTX_INDEX=$(( CTX_INDEX + 1 ))
# done


# /usr/local/bin/task minimal $FILTER | tail -n +4
