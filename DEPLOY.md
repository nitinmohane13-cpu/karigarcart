# DIY Store — Deployment Runbook

## One-time setup (local)

```powershell
cd D:\Saas_Py\diy-store
npm install
npx prisma generate
```

Copy `.env.example` → `.env.local`, fill in all values.

```powershell
# Create local DB (if testing locally)
# psql -U postgres -c "CREATE DATABASE diy_store_db;"
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev    # runs on localhost:3001
```

---

## Droplet: one-time setup

### 1. Create DB on your existing PostgreSQL

```bash
sudo -u postgres psql
CREATE DATABASE diy_store_db;
CREATE USER diy_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE diy_store_db TO diy_user;
\q
```

### 2. Install PM2 (if not already)

```bash
sudo npm install -g pm2
```

### 3. Clone repo and install

```bash
cd /var/www
sudo git clone https://github.com/YOUR_REPO/diy-store.git
sudo chown -R deploy:deploy diy-store
cd diy-store
npm install
```

### 4. Create .env on server

```bash
nano .env
# Fill in:
# DATABASE_URL="postgresql://diy_user:your_password@localhost:5432/diy_store_db"
# NEXTAUTH_SECRET="openssl rand -base64 32"
# NEXTAUTH_URL="https://diystore.yourdomain.com"
# RAZORPAY_KEY_ID=...
# RAZORPAY_KEY_SECRET=...
# NEXT_PUBLIC_RAZORPAY_KEY_ID=...
# NEXT_PUBLIC_APP_URL="https://diystore.yourdomain.com"
```

### 5. Migrate and seed

```bash
npx prisma migrate deploy
node prisma/seed.js
```

### 6. Build and start

```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup    # follow the printed command to enable on reboot
```

### 7. Nginx

```bash
sudo cp nginx-diy-store.conf /etc/nginx/sites-available/diy-store
sudo ln -s /etc/nginx/sites-available/diy-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. SSL

```bash
sudo certbot --nginx -d diystore.yourdomain.com
```

---

## Deploy workflow (every subsequent push)

Local:
```powershell
git add .
git commit -m "your message"
git push origin main
```

Droplet:
```bash
cd /var/www/diy-store
git pull origin main
npm install                        # only if package.json changed
npx prisma migrate deploy          # only if schema changed
npm run build
pm2 restart diy-store
```

---

## Admin credentials (change after first login)

- Email: admin@diystore.in
- Password: Admin@123
- Admin panel: https://diystore.yourdomain.com/admin

---

## Ports in use

| Service     | Port |
|-------------|------|
| RIMai ERP   | 8000 (gunicorn) |
| DIY Store   | 3001 (Next.js)  |
| Nginx       | 80 / 443        |
| PostgreSQL  | 5432            |
