#!/bin/bash

timeout_shim() {
    local duration=$1
    shift
    perl -e 'alarm shift; exec @ARGV' "$duration" "$@"
    local res=$?
    if [ $res -eq 142 ]; then
        return 124
    fi
    return $res
}

echo "Testing timeout success..."
timeout_shim 2 echo "success"
echo "Exit: $?"

echo "Testing timeout failure..."
timeout_shim 1 sleep 2
echo "Exit: $?"
