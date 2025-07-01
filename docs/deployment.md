# Deployment Guide

URLPixel Open Source supports multiple deployment methods. Choose the one that best fits your needs:

## 🚀 Railway (Recommended - 2 minutes)

Railway provides the fastest and easiest deployment with automatic HTTPS and global CDN.

### One-Click Deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/urlpixel-open)

1. Click the deploy button above
2. Connect your GitHub account (if needed)
3. Wait for the build to complete (~2-3 minutes)
4. Your screenshot API is ready!

### Manual Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Clone and deploy
git clone https://github.com/karinadalca/url-pixel-open.git
cd url-pixel-open
railway deploy
```

### Railway Configuration
The `railway.toml` file configures:
- Health check endpoint
- Automatic restarts on failure
- Environment variables
- Build settings

### Environment Variables (Railway)
Set these in the Railway dashboard:
- `API_KEY` (optional) - Enable authentication
- `NODE_ENV` - Set to "production"

## 🐳 Docker (5 minutes)

Perfect for local development or self-hosted production.

### Quick Start with Docker Compose
```bash
# Clone the repository
git clone https://github.com/karinadalca/url-pixel-open.git
cd url-pixel-open

# Start with Docker Compose
docker-compose up -d

# Check health
curl http://localhost:3000/health
```

### Manual Docker Commands
```bash
# Build the image
docker build -t urlpixel-open .

# Run the container
docker run -d \
  --name urlpixel \
  -p 3000:3000 \
  -e NODE_ENV=production \
  urlpixel-open

# Check logs
docker logs urlpixel
```

### Production Docker Setup
```bash
# Run with resource limits and restart policy
docker run -d \
  --name urlpixel-prod \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e API_KEY=your-secret-key \
  --memory=1g \
  --cpus=1 \
  --restart=unless-stopped \
  urlpixel-open
```

### Docker Health Monitoring
```bash
# Check container health
docker ps
docker exec urlpixel curl http://localhost:3000/health

# View resource usage
docker stats urlpixel
```

## 💻 Manual Installation (10 minutes)

For maximum control or development purposes.

### Prerequisites
- Node.js 18 or higher
- Git
- 1GB+ RAM recommended

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone https://github.com/karinadalca/url-pixel-open.git
cd url-pixel-open
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment (Optional)
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

#### 4. Start the Service
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

#### 5. Test Installation
```bash
# Health check
curl http://localhost:3000/health

# Take a test screenshot
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Production Process Management

#### Using PM2
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name urlpixel-open

# Enable startup script
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs urlpixel-open
```

#### Using systemd (Linux)
```bash
# Create service file
sudo nano /etc/systemd/system/urlpixel.service
```

```ini
[Unit]
Description=URLPixel Open Source Screenshot Service
After=network.target

[Service]
Type=simple
User=urlpixel
WorkingDirectory=/opt/urlpixel-open
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable urlpixel
sudo systemctl start urlpixel

# Check status
sudo systemctl status urlpixel
```

## ☁️ Cloud Deployments

### Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-urlpixel-app

# Add buildpack for Puppeteer
heroku buildpacks:add jontewks/puppeteer

# Deploy
git push heroku main

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set API_KEY=your-secret-key

# Check logs
heroku logs --tail
```

### DigitalOcean App Platform
1. Fork the repository to your GitHub
2. Create new app in DigitalOcean App Platform
3. Connect your GitHub repository
4. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
5. Set environment variables in the dashboard
6. Deploy!

### Vercel (Functions)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add API_KEY
```

### AWS EC2
```bash
# Connect to your EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies for Puppeteer
sudo apt-get install -y \
  chromium-browser \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libxss1 \
  libxtst6 \
  xdg-utils

# Clone and setup
git clone https://github.com/karinadalca/url-pixel-open.git
cd url-pixel-open
npm install

# Setup reverse proxy with nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/urlpixel
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/urlpixel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start URLPixel with PM2
npm install -g pm2
pm2 start server.js --name urlpixel
pm2 startup
pm2 save
```

## 🔒 Security Configuration

### Enable API Key Authentication
```bash
# Set environment variable
export API_KEY="your-very-secure-random-key"

# Or in .env file
echo "API_KEY=your-very-secure-random-key" >> .env
```

### Firewall Configuration
```bash
# Ubuntu/Debian - Allow only necessary ports
sudo ufw allow 22   # SSH
sudo ufw allow 80   # HTTP
sudo ufw allow 443  # HTTPS
sudo ufw enable
```

### SSL/HTTPS Setup
For production deployments, use SSL:

#### With Let's Encrypt (Certbot)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Maintenance

### Health Monitoring Script
```bash
#!/bin/bash
# health-check.sh

URL="http://localhost:3000/health"
WEBHOOK_URL="your-webhook-url"  # Optional: Slack, Discord, etc.

response=$(curl -s $URL)
status=$(echo "$response" | jq -r '.status')

if [ "$status" != "healthy" ]; then
    echo "⚠️ URLPixel health check failed!"
    echo "$response"
    
    # Optional: Send notification
    # curl -X POST $WEBHOOK_URL -d "URLPixel is down!"
    
    exit 1
else
    echo "✅ URLPixel is healthy"
fi
```

### Log Rotation
```bash
# Install logrotate configuration
sudo nano /etc/logrotate.d/urlpixel
```

```
/var/log/urlpixel/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
}
```

### Resource Monitoring
```bash
# Check memory usage
ps aux | grep node

# Check disk space
df -h

# Monitor in real-time
top -p $(pgrep -f "node.*server.js")
```

## 🔧 Troubleshooting

### Common Issues

#### Puppeteer Chrome Not Found
```bash
# Install Chrome dependencies
sudo apt-get install -y chromium-browser

# Or set executable path
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
```

#### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 PID

# Or use different port
export PORT=3001
```

#### Memory Issues
```bash
# Check memory usage
free -h

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### Service Won't Start
```bash
# Check logs
npm start 2>&1 | tee debug.log

# Test dependencies
node -e "console.log('Node.js works')"
npm test

# Verify permissions
ls -la
chmod +x server.js
```

### Performance Optimization

#### Memory Optimization
```bash
# Set Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=1024"
```

#### Process Limits
```bash
# Increase file descriptor limits
echo "urlpixel soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "urlpixel hard nofile 65536" | sudo tee -a /etc/security/limits.conf
```

## 📈 Scaling

### Load Balancing
For high traffic, run multiple instances:

```bash
# Run multiple instances
PORT=3001 pm2 start server.js --name urlpixel-1
PORT=3002 pm2 start server.js --name urlpixel-2
PORT=3003 pm2 start server.js --name urlpixel-3
```

Configure nginx upstream:
```nginx
upstream urlpixel {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    location / {
        proxy_pass http://urlpixel;
    }
}
```

### Upgrade to URLPixel.com
When you need more performance and features:
- 🏗️ Site organization and project management
- ⚡ 10x faster with browser pooling
- 📊 Analytics and monitoring dashboard
- 🔗 Webhooks and bulk processing
- 💼 Professional support

Visit [URLPixel.com](https://urlpixel.com) for production features!
