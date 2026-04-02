# Quranesh VPS Setup Guide

Complete instructions for deploying quranesh.com on an Ubuntu VPS with local PostgreSQL.

---

## Prerequisites

- Ubuntu 22.04+ VPS
- Nginx already installed and running
- Domain quranesh.com pointing to this VPS
- SSL certificate (Let's Encrypt) already configured by existing nginx
- Root or sudo access

---

## Step 1: Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # should print v20.x.x
```

---

## Step 2: Install PostgreSQL 16

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

---

## Step 3: Create Database and User

```bash
sudo -u postgres psql <<EOF
CREATE USER quranesh WITH PASSWORD 'CHOOSE_A_STRONG_PASSWORD';
CREATE DATABASE quranesh OWNER quranesh;
GRANT ALL PRIVILEGES ON DATABASE quranesh TO quranesh;
EOF
```

---

## Step 4: Import the Production SQL Dump

The file `backup/quranesh-production.sql` (committed in the repo) contains all 29 tables and all production data.

```bash
cd /var/www/quranesh    # or wherever you cloned the repo
sudo -u postgres psql quranesh < backup/quranesh-production.sql
```

Verify:
```bash
sudo -u postgres psql quranesh -c "\dt"
# Should list 29 tables

sudo -u postgres psql quranesh -c "SELECT COUNT(*) FROM users;"
# Should show ~131 rows
```

---

## Step 5: Install PM2

```bash
sudo npm install -g pm2
pm2 startup    # follow the printed command to auto-start on reboot
```

---

## Step 6: Clone / Pull the Repo

```bash
# First time
sudo mkdir -p /var/www/quranesh
sudo chown $USER:$USER /var/www/quranesh
git clone https://github.com/mediaoasisksa/quranesh.git /var/www/quranesh
cd /var/www/quranesh

# Subsequent updates
cd /var/www/quranesh
git pull
```

---

## Step 7: Install Dependencies and Build

```bash
cd /var/www/quranesh
npm install
npm run build
```

The build produces:
- `dist/index.js` — compiled Express server
- `dist/public/` — compiled React frontend

---

## Step 8: Set Environment Variables

Create `/var/www/quranesh/.env` (or set via PM2 ecosystem file):

```bash
cat > /var/www/quranesh/.env <<EOF
DATABASE_URL=postgresql://quranesh:CHOOSE_A_STRONG_PASSWORD@localhost:5432/quranesh
NODE_ENV=production
PORT=5000
JWT_SECRET=GENERATE_A_LONG_RANDOM_STRING_HERE

# HyperPay Production Credentials
HYPERPAY_PROD_ACCESS_TOKEN=your_production_access_token
HYPERPAY_PROD_ENTITY_ID_VISA_MASTER=your_visa_master_entity_id
HYPERPAY_PROD_ENTITY_ID_MADA=your_mada_entity_id
HYPERPAY_SERVER_URL=https://eu-prod.oppwa.com

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key
EOF
```

---

## Step 9: Configure Nginx

Edit your nginx site config (e.g. `/etc/nginx/sites-available/quranesh.com`):

```nginx
server {
    listen 443 ssl;
    server_name quranesh.com www.quranesh.com;

    # SSL config (Let's Encrypt handles this)
    ssl_certificate /etc/letsencrypt/live/quranesh.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quranesh.com/privkey.pem;

    # Proxy all API and Socket.io requests to Express
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # All other requests go to Express (which serves dist/public/)
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 80;
    server_name quranesh.com www.quranesh.com;
    return 301 https://$host$request_uri;
}
```

Test and reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 10: Start the Application with PM2

```bash
cd /var/www/quranesh
pm2 start dist/index.js --name quranesh --env production
pm2 save
```

---

## Step 11: Verify

```bash
# Check server is running
pm2 status

# Check logs
pm2 logs quranesh --lines 50

# Test API
curl https://quranesh.com/api/version
# Expected: {"build":"2026-03-26-0918","ok":true}

curl https://quranesh.com/api/debug/db-test
# Expected: {"ok":true,"userCount":131,...}
```

---

## Updating the Application

```bash
cd /var/www/quranesh
git pull
npm install
npm run build
pm2 restart quranesh
```

---

## Database Backup (Manual)

```bash
PGPASSWORD=CHOOSE_A_STRONG_PASSWORD pg_dump \
  -U quranesh \
  -h localhost \
  --clean --if-exists --no-owner --no-acl \
  quranesh > backup/quranesh-$(date +%Y%m%d).sql
```

---

## Troubleshooting

| Issue | Command |
|-------|---------|
| Check PM2 logs | `pm2 logs quranesh` |
| Restart app | `pm2 restart quranesh` |
| Check nginx errors | `sudo tail -f /var/log/nginx/error.log` |
| Check PostgreSQL | `sudo -u postgres psql quranesh -c "SELECT NOW();"` |
| Port already in use | `lsof -i :5000` then `kill -9 <PID>` |
