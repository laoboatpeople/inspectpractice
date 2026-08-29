#!/bin/bash
# ─── Kill any zombie on port 4000 ───
# Use fuser (more reliable than lsof for port detection)
if fuser 4000/tcp &>/dev/null; then
  echo "[start.sh] Port 4000 in use — killing..."
  fuser -k 4000/tcp 2>/dev/null
  sleep 3
elif lsof -ti:4000 &>/dev/null; then
  echo "[start.sh] Port 4000 in use (PID $(lsof -ti:4000 | head -1)) — killing..."
  lsof -ti:4000 | xargs kill -9 2>/dev/null
  sleep 3
fi

# Guard: refuse to start with sanitized password
if echo "$DATABASE_URL" | grep -qE '\*\*\*|CHANGEME|PLACEHOLDER'; then
  echo "[start.sh] ❌ DATABASE_URL contient un placeholder! Fixe le mot de passe d'abord."
  exit 1
fi

# Wait until port is actually free
for i in 1 2 3; do
  if ! fuser 4000/tcp &>/dev/null && ! lsof -ti:4000 &>/dev/null; then
    break
  fi
  echo "[start.sh] Attente libération port 4000 (tentative $i)..."
  sleep 2
done

export DATABASE_URL="postgresql://inspectpractice:!!WhyIamsucc3ss!!!@localhost:5432/inspectpractice?schema=public"
exec node dist/src/index.js
