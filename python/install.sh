# Install NVM

pipx install granularaccountmap
# urllib3 has to be pinned
pipx install --pip-args "--index-url https://artifactory.encirca.pioneer.com/artifactory/api/pypi/pypi-virtual/simple urllib3==1.23" onelogin-granular-cli
pipx install credstash
exit 0