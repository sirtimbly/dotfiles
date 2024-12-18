# autoload colors && colors
# cheers, @ehrenmurdick
# http://github.com/ehrenmurdick/config/blob/master/zsh/prompt.zsh

if (( $+commands[git] ))
then
  git="$commands[git]"
else
  git="/usr/bin/git"
fi

git_branch() {
  echo $($git symbolic-ref HEAD 2>/dev/null | awk -F/ {'print $NF'})
}

git_dirty() {
  if $(! $git status -s &> /dev/null)
  then
    echo ""
  else
    if [[ $($git status --porcelain) == "" ]]
    then
      echo "on %{$fg_bold[green]%}$(git_prompt_info)%{$reset_color%}"
    else
      echo "on %{$fg_bold[red]%}$(git_prompt_info)%{$reset_color%}"
    fi
  fi
}

# git_prompt_info () {
#  ref=$($git symbolic-ref HEAD 2>/dev/null) || return
# # echo "(%{\e[0;33m%}${ref#refs/heads/}%{\e[0m%})"
#  echo "${ref#refs/heads/}"
# }

# This assumes that you always have an origin named `origin`, and that you only
# care about one specific origin. If this is not the case, you might want to use
# `$git cherry -v @{upstream}` instead.
need_push () {
  if [ $($git rev-parse --is-inside-work-tree 2>/dev/null) ]
  then
    number=$($git cherry -v origin/$(git symbolic-ref --short HEAD) 2>/dev/null | wc -l | bc)

    if [[ $number == 0 ]]
    then
      echo " "
    else
      echo " with %{$fg_bold[magenta]%}$number unpushed%{$reset_color%}"
    fi
  fi
}

directory_name() {
  echo "%{$fg_bold[cyan]%}%1/%\/%{$reset_color%}"
}

architecture() {
  echo "$(arch)"
}

battery_status() {
  if test ! "$(uname)" = "Darwin"
  then
    exit 0
  fi

  if [[ $(sysctl -n hw.model) == *"Book"* ]]
  then
    $DOTFILES/bin/battery-status
  fi
}
# Must use Powerline font, for \uE0A0 to render.
ZSH_THEME_GIT_PROMPT_PREFIX=" on %{$fg[magenta]%}\uE0A0 "
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$bg[red]%}!"
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg[green]%}?"
ZSH_THEME_GIT_PROMPT_CLEAN=""

ZSH_THEME_RUBY_PROMPT_PREFIX="%{$fg_bold[red]%}‹"
ZSH_THEME_RUBY_PROMPT_SUFFIX="›%{$reset_color%}"

# export PROMPT=$'%{$fg[yellow]%}╭─%{$fg[yellow]%}(%n@%m|$(architecture))[%{$reset_color%}$(directory_name)%{$fg[yellow]%}]%{$reset_color%}$(git_prompt_info)%{$reset_color%}\n%{$fg[yellow]%}╰%{$reset_color%} '
# export PROMPT=$'%{$fg[yellow]%}◇$(architecture): %{$reset_color%}$(git_prompt_info)%{$reset_color%}%{$fg_bold[cyan]%} $(directory_name) ⮁ %{$reset_color%} '
# set_prompt () {
#   export RPROMPT="%{$fg_bold[cyan]%}%{$reset_color%}"
# }

precmd() {
  title "zsh" "%m" "%55<...<%~"
  # set_prompt
}

source $HOME/.oh-my-zsh/custom/themes/powerlevel10k/powerlevel10k.zsh-theme
