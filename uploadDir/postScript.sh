#!/bin/bash
echo "Running pre-deployment script..."

# --- Live deployment URLs (EC2) ---
DEPLOY_HOST="http://ec2-13-212-238-224.ap-southeast-1.compute.amazonaws.com"
export VITE_API_URL="${DEPLOY_HOST}:3001/api/v1"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$APP_DIR" || exit 1

if [ -f "$APP_DIR/.env" ]; then
  set -a
  # shellcheck source=/dev/null
  source "$APP_DIR/.env"
  set +a
  echo "Loaded environment from $APP_DIR/.env"
fi

echo "Starting deployment script..."
echo "App directory: $APP_DIR"
echo "API URL: $VITE_API_URL"

echo "Installing app dependencies..."
npm install -f --prefix "$APP_DIR" >> /root/npm-ci-seef-candidate-web.txt 2>&1 || echo "npm install failed"

echo "Building candidate web..."
npm run build --prefix "$APP_DIR" >> /root/build-seef-candidate-web.txt 2>&1 || echo "npm run build failed"

PM2_NAME="seef-candidate-staging"
PORT=5174
PM2_LOG_DIR="/root"
PM2_DELETE_LOG="$PM2_LOG_DIR/pm2-delete-seef-candidate-web.txt"
PM2_START_LOG="$PM2_LOG_DIR/pm2-start-seef-candidate-web.txt"
PM2_SAVE_LOG="$PM2_LOG_DIR/pm2-save-seef-candidate-web.txt"
PM2_STATUS_LOG="$PM2_LOG_DIR/pm2-status-seef-candidate-web.txt"

run_pm2_step() {
  local log_file="$1"
  local label="$2"
  shift 2
  {
    echo "===== [$label] $(date -Iseconds) ====="
    echo "CMD: $*"
  } >> "$log_file" 2>&1
  if "$@" >> "$log_file" 2>&1; then
    echo "RESULT: OK" >> "$log_file"
  else
    echo "RESULT: FAILED (exit $?)" >> "$log_file"
  fi
  echo "" >> "$log_file"
  return 0
}

run_pm2_step "$PM2_DELETE_LOG" "pm2 delete" pm2 delete "$PM2_NAME" || true
run_pm2_step "$PM2_START_LOG" "pm2 start" pm2 serve "$APP_DIR/dist" "$PORT" --name "$PM2_NAME" --spa || true
run_pm2_step "$PM2_SAVE_LOG" "pm2 save" pm2 save || true
run_pm2_step "$PM2_STATUS_LOG" "pm2 status" pm2 status || true

echo "Deployment completed ✅"
echo "Live URL: ${DEPLOY_HOST}:${PORT}"
