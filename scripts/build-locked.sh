#!/bin/sh
# Serializes concurrent `astro build` runs (used while several authors/agents
# work in parallel). Usage: sh scripts/build-locked.sh
LOCK="${TMPDIR:-/tmp}/learn-rust-build.lock"
while ! mkdir "$LOCK" 2>/dev/null; do sleep 2; done
trap 'rmdir "$LOCK"' EXIT INT TERM
bun run build
