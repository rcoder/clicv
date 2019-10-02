#!/bin/sh

set -e

./vendor/ttyd_linux.x86_64 tmux -f ./tmux.conf new-session node dist/main.js
