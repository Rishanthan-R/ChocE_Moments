# 🗄️ XAMPP MySQL Database Setup Guide

Your webapp is running on **http://localhost:3000**, and XAMPP is already installed. Let's set up the database!

---

## ✅ Step 1: Start XAMPP

### Using XAMPP Control Panel
1. Open **XAMPP Control Panel** (xampp-control.exe)
2. Click **Start** next to **MySQL**
3. You should see:
   ```
   MySQL: Running (PID: xxx)
   ```

### Verify MySQL is Running
Open PowerShell and run:
```powershell
mysql --version
```

Should show something like: `mysql  Ver 8.x.x for Win64`

---

## ✅ Step 2: Create Database

### Method 1: Using MySQL Command Line (Easiest)

Open PowerShell and run:
```powershell
mysql -u root
```

You should see:
```
Welcome to the MySQL monitor. Commands end with ; or \g.
Your MySQL connection id is...
```

Then type:
```sql
CREATE DATABASE choce_moments;
```

Should show: `Query OK, 1 row affected`

Verify it was created:
```sql
SHOW DATABASES;
```

You should see `choce_moments` in the list.

Exit MySQL:
```sql
EXIT;
```

---

### Method 2: Using phpMyAdmin (GUI - Easier for Beginners)

1. Start XAMPP (MySQL should be running)
2. Open browser and go to: **http://localhost/phpmyadmin**
3. Click **New** on the left sidebar
4. Enter database name: `choce_moments`
5. Click **Create**

That's it! Database created.

---

## ✅ Step 3: Update Backend Configuration

### Update `.env` File

Open `backend/.env` and update:

```env
# Server
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=choce_moments

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2025
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret_key_2025
JWT_REFRESH_EXPIRE=7d
```

**Important:** Change `CLIENT_URL` from `http://localhost:5173` to **`http://localhost:3000`**

---

## ✅ Step 4: Start Backend Server

In PowerShell, navigate to backend folder:
```bash
cd "e:\Bussiness ideas\ChocE Moments\Website\ChocE_Moments\backend"
npm run dev
```

You should see:
```
✅ MySQL Database connected successfully
✅ Database synchronized

╔════════════════════════════════════════╗
║   ChocE Moments Backend Server         ║
╠════════════════════════════════════════╣
║   Port: 5000                           ║
║   Environment: development             ║
║   Status: ✅ Running                    ║
╚════════════════════════════════════════╝
```

---

## ✅ Step 5: Test Backend

### Quick Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"success": true, "message": "Server is running"}
```

### Full Testing
1. Open Postman
2. Import: `backend/ChocE_Moments_Auth_API.postman_collection.json`
3. Run all requests
4. All should pass ✅

---

## 🔍 Troubleshooting XAMPP MySQL

### MySQL Won't Start in XAMPP
```
Error: MySQL shutdown unexpectedly
```

**Solution:**
1. Click **Stop** for MySQL
2. Wait 5 seconds
3. Click **Start** again
4. If still fails, restart XAMPP Control Panel

### Port 3306 Already in Use
```
Error: Can't connect to MySQL server on 'localhost' (10061)
```

**Solution:**
1. Check if another MySQL is running
2. Or change PORT in `.env` to 3307
3. Restart backend

### Access Denied (1045)
```
Error: Access denied for user 'root'@'localhost'
```

**Solution - If XAMPP has password:**

Edit `backend/.env`:
```env
DB_USER=root
DB_PASSWORD=your_xampp_password
```

**Find XAMPP password:**
- Look in: `C:\xampp\mysql\data\mysql\root.json`
- Or check XAMPP documentation

**For default XAMPP (no password):**
```env
DB_PASSWORD=
```

### Database Won't Create
Check if database exists:
```bash
mysql -u root -e "SHOW DATABASES;"
```

If `choce_moments` is there, you're good!

If not, create manually:
```bash
mysql -u root -e "CREATE DATABASE choce_moments;"
```

---

## 📊 Verify Setup

### Check MySQL Connection
```powershell
mysql -u root -e "SELECT 1;"
```

Should show: `1` (connected successfully)

### Check Database Exists
```powershell
mysql -u root -e "USE choce_moments; SHOW TABLES;"
```

After backend starts, should show: `users` table

### Check Users Table
```powershell
mysql -u root -e "SELECT * FROM choce_moments.users;"
```

After signup, should show new users

---

## 🎯 Quick Commands Reference

```bash
# Start XAMPP MySQL
# (Use XAMPP Control Panel GUI)

# Connect to MySQL
mysql -u root

# Create database
mysql -u root -e "CREATE DATABASE choce_moments;"

# Check databases
mysql -u root -e "SHOW DATABASES;"

# Check tables in database
mysql -u root -e "SHOW TABLES FROM choce_moments;"

# Exit MySQL
mysql -u root -e "EXIT;"
```

---

## ✅ Complete Setup Checklist

- [ ] XAMPP installed and MySQL running
- [ ] Database `choce_moments` created
- [ ] `.env` updated with CLIENT_URL=http://localhost:3000
- [ ] Backend started: `npm run dev`
- [ ] Health check working: `curl http://localhost:5000/api/health`
- [ ] Postman collection imported and tested
- [ ] Database has `users` table

---

## 🚀 Next Steps

1. ✅ Database is ready
2. ✅ Backend is running on http://localhost:5000
3. ✅ Frontend is running on http://localhost:3000
4. 👉 **Next:** Follow [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)

---

## 📞 Still Having Issues?

### Check Backend Logs
```
✅ MySQL Database connected successfully
✅ Database synchronized
```

If you see these messages, database is working!

### Check XAMPP Status
Open XAMPP Control Panel:
```
MySQL: Running (Green)
```

If not green, click **Start**

### Test Database Directly
```powershell
mysql -u root choce_moments -e "SELECT COUNT(*) FROM users;"
```

Should return: `0` (no users yet) or existing user count

---

**Status: ✅ Database Setup Complete!**

👉 Next: Follow [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) to update your React app
