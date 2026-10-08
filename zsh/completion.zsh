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
    assume_path=$(whence -p assume)

    # The Bedrock profile must resolve through granted's credential_process.
    # `assume` exports static keys that expire and then outrank the profile in
    # every process started from this shell (OpenCode, Claude Code), so strip
    # them for that profile and restore it after `assume -u`.
    assume() {
        source "$assume_path" "$@"
        local ret=$?
        local bedrock_profile=corteva-workload-dev/AIDeveloperRole
        if [[ -z "${AWS_PROFILE:-}" ]]; then
            export AWS_PROFILE=$bedrock_profile AWS_REGION=us-east-1
        fi
        if [[ "$AWS_PROFILE" == "$bedrock_profile" && -n "${AWS_ACCESS_KEY_ID:-}" ]]; then
            unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_SESSION_TOKEN \
                AWS_SESSION_EXPIRATION AWS_CREDENTIAL_EXPIRATION
            echo "assume: dropped static keys for $bedrock_profile; it uses credential_process. Log in with aws-bedrock-login --login." >&2
        fi
        return $ret
    }

    # reload completions if needed
    assume-completions-reload() {
        granted completion -s zsh
    }
fi
export GRANTED_ALIAS_CONFIGURED="true"

# if test ! $(which jira); then
#     eval "$(jira --completion-script-bash)"
# fi

# if test ! $(which dstask); then
#     dstask zsh-completion > /usr/local/share/zsh/site-functions/_dstask
# fi
