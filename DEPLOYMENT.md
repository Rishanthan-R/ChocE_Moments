# Deployment Guide for AWS Ubuntu

This guide covers the steps to deploy your ChocE_Moments application (React Frontend + Node.js Backend) to an AWS EC2 instance running Ubuntu.

## 1. Server Prerequisites

Connect to your Ubuntu instance via SSH.

Update the system and install necessary packages:

```bash
# Update package list and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and NPM installation
node -v
npm -v

# Install PM2 (Process Manager for Node.js) globally
sudo npm install -g pm2

# Install Nginx (Web Server)
sudo apt install -y nginx

# Allow Nginx through firewall (if ufw is enabled)
sudo ufw allow 'Nginx Full'
```

## 2. Application Setup

Clone your repository to the server (e.g., in your home directory or `/var/www`).

```bash
# Example: Cloning to home directory
git clone <YOUR_REPO_URL> choce-moments
cd choce-moments
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the production environment file:
   ```bash
   nano .env
   ```
   Paste your production configuration (ensure you use `PORT=5001` to match your Nginx config later):
   ```env
   DATABASE_URL="mongodb+srv://<YOUR_MONGO_CONNECTION_STRING>"
   JWT_SECRET="<YOUR_SECURE_RANDOM_SECRET>"
   PORT=5001
   ```
   *Press `Ctrl+X`, then `Y`, then `Enter` to save.*

4. Start the backend with PM2:
   ```bash
   pm2 start index.js --name "choce-backend"
   ```

5. Save the PM2 list to restart on reboot:
   ```bash
   pm2 save
   pm2 startup
   # Follow the instruction printed by the command above
   ```

### Frontend Setup

1. Navigate to the project root (where `vite.config.ts` is):
   ```bash
   cd ..
   # You should be in choce-moments/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend for production.
   **Crucial Step:** We need to set the `API_BASE_URL` to point to your server's API path. Since we will configure Nginx to proxy `/api` requests to the backend, we can use a relative path `/api`.

   ```bash
   # Build with the customized API URL
   VITE_API_BASE_URL=/api npm run build
   ```

   This command will generate a `dist` folder containing your static website.

## 3. Configure Nginx

We will configure Nginx to serve the frontend files and reverse proxy API requests to your Node.js backend.

1. Create a new Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/choce-moments
   ```

2. Paste the following configuration. Replace `your_domain_or_ip` with your actual Domain Name or Public IP Address.

   ```nginx
   server {
       listen 80;
       server_name your_domain_or_ip; # e.g., 54.123.45.67 or example.com

       root /home/ubuntu/choce-moments/dist; # Path to your dist folder
       index index.html;

       # Frontend: Serve React App
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Backend: Proxy API requests to Node.js
       location /api {
           proxy_pass http://localhost:5001; # Matches PORT in backend/.env
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   *Note: If you cloned to a different path, update the `root` directive accordingly (e.g., if you are user 'ubuntu', the home path is /home/ubuntu).*

3. Enable the configuration:
   ```bash
   sudo ln -s /etc/nginx/sites-available/choce-moments /etc/nginx/sites-enabled/
   ```

4. Check for syntax errors:
   ```bash
   sudo nginx -t
   ```
   *If you see "default" site enabled, verify it doesn't conflict. Safe to split:*
   ```bash
   sudo rm /etc/nginx/sites-enabled/default
   ```

5. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

## 4. Final Checks

1. Open your browser and visit `http://<YOUR_IP_OR_DOMAIN>`.
2. You should see your application.
3. Try logging in or performing an action to verify the API connection.

## 5. (Optional) SSL with Certbot

If you have a customized domain (e.g., `www.example.com`), secure it with HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```
