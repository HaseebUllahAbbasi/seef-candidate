#!/bin/bash
echo "Running pre-deployment script..."

# --- Build-time environment (update for staging/production) ---
export VITE_API_URL="http://localhost:3001/api/v1"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."
if [ -f .env ]; then
  set -a
  # shellcheck source=/dev/null
  source .env
  set +a
  echo "Loaded environment from .env"
fi

echo "Starting deployment script..."
echo "Installing app dependencies..."
npm install -f >> /root/npm-ci-seef-candidate-web.txt 2>&1 || echo "npm install failed"

echo "Building candidate web..."
npm run build >> /root/build-seef-candidate-web.txt 2>&1 || echo "npm run build failed"

PM2_NAME="seef-candidate-staging"
PORT=5174
pm2 delete "$PM2_NAME" >> /root/pm2-delete-seef-candidate-web.txt 2>&1 || echo "pm2 delete failed"
pm2 serve dist "$PORT" --name "$PM2_NAME" --spa >> /root/pm2-start-seef-candidate-web.txt 2>&1 || echo "pm2 start failed"
pm2 save >> /root/pm2-save-seef-candidate-web.txt 2>&1 || echo "pm2 save failed"
pm2 status || echo "pm2 status failed"

echo "Deployment completed ✅"
