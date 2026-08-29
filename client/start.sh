#!/bin/bash
# ─── Kill any zombie on port 3002 ───
if lsof -ti:3002 &>/dev/null; then
  echo "[start.sh] Port 3002 in use (PID $(lsof -ti:3002 | head -1)) — killing..."
  lsof -ti:3002 | xargs kill -9 2>/dev/null
  sleep 1
fi

exec /home/chuck/projects/inspectpractice/client/node_modules/next/dist/bin/next start -p 3002
