# 🚀 Deployment Guide

This guide covers deploying the Cattle Disease Detection System to production environments.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Deployment Options](#deployment-options)
- [Production Checklist](#production-checklist)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Services
- **VPS/Cloud Server** (AWS, DigitalOcean, Azure, etc.)
- **MongoDB Atlas** (or self-hosted MongoDB)
- **Domain Name** (optional but recommended)
- **SSL Certificate** (Let's Encrypt recommended)

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or higher
- **RAM**: Minimum 2GB (4GB recommended)
- **Storage**: Minimum 20GB
- **CPU**: 2 cores minimum

## 🔧 Environment Setup

### 1. Server Initial Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.8+
sudo apt install -y python3 python3-pip

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 2. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/Ayisha114/cattle-disease-detection-pro.git
cd cattle-disease-detection-pro

# Set permissions
sudo chown -R $USER:$USER /var/www/cattle-disease-detection-pro
```

### 3. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string

#### Option B: Self-Hosted MongoDB
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Backend Setup

```bash
cd /var/www/cattle-disease-detection-pro/backend

# Install dependencies
npm install --production

# Create production .env file
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=$(openssl rand -base64 32)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ML_MODEL_PATH=../ml-model/model.h5
PYTHON_PATH=/usr/bin/python3
EOF

# Create uploads directory
mkdir -p uploads
chmod 755 uploads
```

### 5. Frontend Setup

```bash
cd /var/www/cattle-disease-detection-pro/frontend

# Install dependencies
npm install

# Create production .env file
cat > .env << EOF
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Cattle Disease Detection
VITE_MAX_UPLOAD_SIZE=10485760
EOF

# Build for production
npm run build
```

### 6. ML Model Setup

```bash
cd /var/www/cattle-disease-detection-pro/ml-model

# Install Python dependencies
pip3 install -r requirements.txt

# Ensure model file exists
# Place your trained model.h5 in this directory
```

## 🌐 Deployment Options

### Option 1: PM2 + Nginx (Recommended)

#### Start Backend with PM2

```bash
cd /var/www/cattle-disease-detection-pro/backend

# Start application
pm2 start server.js --name cattle-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command output instructions
```

#### Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/cattle-disease
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/cattle-disease-detection-pro/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads
    location /uploads {
        alias /var/www/cattle-disease-detection-pro/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/cattle-disease /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

### Option 2: Docker Deployment

#### Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

Deploy with Docker:

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## ✅ Production Checklist

### Security
- [ ] Change default JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Configure firewall (UFW)
- [ ] Regular security updates

### Performance
- [ ] Enable Gzip compression
- [ ] Configure caching headers
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Use CDN for static assets
- [ ] Database indexing
- [ ] Connection pooling
- [ ] Load balancing (if needed)

### Monitoring
- [ ] Setup error logging
- [ ] Configure PM2 monitoring
- [ ] Setup uptime monitoring
- [ ] Database backups
- [ ] Disk space monitoring
- [ ] SSL certificate expiry alerts

### Backup Strategy

```bash
# Create backup script
cat > /var/www/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/cattle-disease"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="your_mongodb_uri" --out="$BACKUP_DIR/db_$DATE"

# Backup uploads
tar -czf "$BACKUP_DIR/uploads_$DATE.tar.gz" /var/www/cattle-disease-detection-pro/backend/uploads

# Remove backups older than 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

# Make executable
chmod +x /var/www/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/backup.sh") | crontab -
```

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# View application status
pm2 status

# View logs
pm2 logs cattle-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart cattle-api

# Reload without downtime
pm2 reload cattle-api
```

### Nginx Monitoring

```bash
# Check Nginx status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log

# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
ps aux | grep node
```

### Database Maintenance

```bash
# Connect to MongoDB
mongo your_connection_string

# Check database size
db.stats()

# Create indexes
db.reports.createIndex({ user_id: 1, timestamp: -1 })
db.users.createIndex({ email: 1 }, { unique: true })

# Backup database
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)
```

## 🔄 Updates & Rollbacks

### Update Application

```bash
cd /var/www/cattle-disease-detection-pro

# Pull latest changes
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart cattle-api

# Update frontend
cd ../frontend
npm install
npm run build
```

### Rollback

```bash
# View commit history
git log --oneline

# Rollback to specific commit
git checkout <commit-hash>

# Rebuild and restart
cd backend && pm2 restart cattle-api
cd ../frontend && npm run build
```

## 🆘 Troubleshooting

### Application won't start
```bash
# Check PM2 logs
pm2 logs cattle-api --lines 100

# Check Node.js version
node --version

# Check environment variables
pm2 env cattle-api
```

### Database connection issues
```bash
# Test MongoDB connection
mongo your_connection_string

# Check network connectivity
ping your-mongodb-host

# Verify credentials
```

### Nginx errors
```bash
# Check configuration syntax
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

## 📞 Support

For deployment issues:
- Check logs first
- Review this guide
- Contact: adadapee@gitam.in
- GitHub Issues: [Create Issue](https://github.com/Ayisha114/cattle-disease-detection-pro/issues)

---

**Happy Deploying! 🚀**
