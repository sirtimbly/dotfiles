# matches case insensitive for lowercase
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

# pasting with tabs doesn't perform completion
zstyle ':completion:*' insert-tab pending
if test ! $(which glab); then
    eval "$(glab completion)"
fi

# copied from configfiles repo here: https://gitlab.internal.granular.ag/granular/shared-tooling/configfiles/-/blob/5faf6002bea7f168b58318f5267304873a884dd6/shrcfiles/4-1-aws.sh#L4-15
if command -v granted &> /dev/null; then
    # setup the assume command
    unalias assume &> /dev/null
    assume_path=$(which assume)
    alias assume="source $assume_path"

    # reload completions if needed
    assume-completions-reload() {
        granted completion -s zsh
    }
fi

if test ! $(which jira); then
    eval "$(jira --completion-script-bash)"
fi

