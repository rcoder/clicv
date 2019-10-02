#!/bin/sh

set -e

sudo -u www-data ./vendor/ttyd_linux.x86_64 node dist/main.js
