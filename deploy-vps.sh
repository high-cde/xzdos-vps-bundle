#!/usr/bin/env bash
set -Eeuo pipefail

# Uso: sudo DOMAIN=x-zdos.it APP_PORT=3100 bash deploy-vps.sh
# Eseguire dalla root del progetto flagship, dopo averlo copiato sulla VPS.
DOMAIN="${DOMAIN:-x-zdos.it}"
APP_NAME="${APP_NAME:-xzdos-unified-webapp}"
APP_DIR="${APP_DIR:-/opt/${APP_NAME}}"
APP_PORT="${APP_PORT:-3100}"
SERVICE="${APP_NAME}.service"
NGINX_FILE="/etc/nginx/sites-available/${APP_NAME}.conf"
ENV_FILE="/etc/${APP_NAME}.env"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Esegui con sudo: sudo DOMAIN=${DOMAIN} bash deploy-vps.sh" >&2
  exit 1
fi
if [[ ! -f "${SOURCE_DIR}/package.json" ]]; then
  echo "package.json non trovato: esegui lo script dalla root del progetto." >&2
  exit 1
fi
if ! grep -qiE 'ubuntu' /etc/os-release; then
  echo "Questo script richiede Ubuntu." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
echo "[1/7] Pacchetti di sistema"
apt-get update -y
apt-get install -y ca-certificates curl nginx build-essential git rsync

if ! command -v node >/dev/null 2>&1 || [[ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]]; then
  echo "[2/7] Installo Node.js 22"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
else
  echo "[2/7] Node.js già compatibile: $(node --version)"
fi
NPM_GLOBAL_PREFIX="$(npm prefix --global)"
export PATH="${NPM_GLOBAL_PREFIX}/bin:/usr/local/bin:/usr/bin:${PATH}"
if command -v corepack >/dev/null 2>&1; then
  corepack enable
  corepack prepare pnpm@10.4.1 --activate
else
  npm install --global pnpm@10.4.1
fi
export PATH="$(npm prefix --global)/bin:/usr/local/bin:/usr/bin:${PATH}"
PNPM_BIN="$(command -v pnpm || true)"
if [[ -z "${PNPM_BIN}" ]]; then
  echo "pnpm non disponibile dopo l’installazione; PATH=${PATH}" >&2
  exit 1
fi
export PNPM_BIN
NODE_BIN="$(command -v node)"
if [[ -z "${NODE_BIN}" ]]; then
  echo "node non disponibile nel PATH" >&2
  exit 1
fi

if [[ -e "${APP_DIR}" && "${APP_DIR}" != "${SOURCE_DIR}" ]]; then
  cp -a "${APP_DIR}" "${APP_DIR}.backup.$(date -u +%Y%m%d%H%M%S)"
fi
mkdir -p "${APP_DIR}"
rsync -a --delete --exclude node_modules --exclude dist --exclude .git "${SOURCE_DIR}/" "${APP_DIR}/"
chown -R root:root "${APP_DIR}"

if [[ ! -f "${ENV_FILE}" ]]; then
  cat > "${ENV_FILE}" <<EOF
NODE_ENV=production
PORT=${APP_PORT}
# Aggiungi DATABASE_URL se vuoi usare il database persistente della VPS.
EOF
  chmod 600 "${ENV_FILE}"
fi

echo "[3/7] Dipendenze e build production"
cd "${APP_DIR}"
"${PNPM_BIN}" install --frozen-lockfile
"${PNPM_BIN}" check
"${PNPM_BIN}" build

cat > "/etc/systemd/system/${SERVICE}" <<EOF
[Unit]
Description=X-ZDOS Unified Evidence Ecosystem
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
EnvironmentFile=${ENV_FILE}
ExecStart=${NODE_BIN} ${APP_DIR}/dist/index.js
Restart=always
RestartSec=5
User=root
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

echo "[4/7] Avvio servizio systemd"
systemctl daemon-reload
systemctl enable --now "${SERVICE}"
sleep 2
systemctl --no-pager --full status "${SERVICE}" || true

if nginx -T 2>/dev/null | grep -q "server_name ${DOMAIN}"; then
  echo "Nginx contiene già server_name ${DOMAIN}; non sovrascrivo il sito attuale." >&2
  echo "Servizio app disponibile localmente su http://127.0.0.1:${APP_PORT}" >&2
  exit 2
fi

echo "[5/7] Configuro reverse proxy Nginx senza SSL e senza cutover DNS"
cat > "${NGINX_FILE}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
ln -sfn "${NGINX_FILE}" "/etc/nginx/sites-enabled/${APP_NAME}.conf"
nginx -t
systemctl reload nginx

echo "[6/7] Endpoint locali"
curl --fail --silent --show-error "http://127.0.0.1:${APP_PORT}/" >/dev/null

echo "[7/7] Deploy pronto"
echo "App:       http://127.0.0.1:${APP_PORT}"
echo "Nginx:     ${DOMAIN} (attiva il DNS solo dopo il test)"
echo "Service:   systemctl status ${SERVICE}"
echo "Logs:      journalctl -u ${SERVICE} -f"
echo "SSL:       sudo certbot --nginx -d ${DOMAIN}   # eseguire solo dopo il DNS"
