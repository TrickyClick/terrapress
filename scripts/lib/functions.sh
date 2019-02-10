#!/bin/bash
function cmd_exists {
  which -s $1
  if [ $? -ne 0 ]; then
    echo "[SETUP] Fatal error: $1 not found"
    exit 1
  fi
}

function env_variable_defined {
  if [ ! -n "${!1+x}" ]; then
    if [ ! -n "${2}" ]; then
      echo "[SETUP] FATAL ERROR: $1 missing"
    else
      echo $2
    fi
    exit 1
  fi
}

export -f cmd_exists
export -f env_variable_defined