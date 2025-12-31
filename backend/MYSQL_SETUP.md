# 🗄️ MySQL Setup Guide for ChocE Moments

## Prerequisites
- Windows 10/11
- Administrator access

---

## Option 1: Using MySQL Community Server (Recommended)

### Step 1: Download MySQL
1. Go to https://dev.mysql.com/downloads/mysql/
2. Select **Windows (x86, 64-bit)** - MySQL Installer MSI
3. Download the installer (mysql-installer-web-community-8.x.x.x.msi)

### Step 2: Install MySQL
1. Run the installer as Administrator
2. Choose **Development Default** setup
3. Accept all defaults
4. Configure MySQL Server:
   - **Config Type:** Development Machine
   - **Port:** 3306
   - **MySQL X Protocol Port:** 33060
   - **Windows Service Name:** MySQL80
5. MySQL Server Configuration:
   - **Server ID:** 1
   - **Standalone MySQL Server**
6. Authentication Method: Use **Strong Password Encryption**
7. Set MySQL Root Password: **(leave blank or set password)**
8. Configure MySQL as Service: ✅ Checked
9. Click Execute, then Finish

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
mysql --version
```

You should see: `mysql  Ver 8.x.x for Win64`

---

## Option 2: Using MySQL Community Server (Windows Portable)

1. Download from: https://dev.mysql.com/downloads/mysql/
2. Extract to `C:\mysql`
3. Open PowerShell as Administrator:
```powershell
cd C:\mysql\bin
.\mysqld --install MySQL80
.\net start MySQL80
```

---

## Option 3: Using MySQL via Windows Package Manager

```powershell
# Install chocolatey first (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MySQL
choco install mysql

# Start service
net start MySQL80
```

---

## Create Database

### Using MySQL Command Line

1. Open PowerShell and connect to MySQL:
```powershell
mysql -u root
```

2. If password set, use:
```powershell
mysql -u root -p
```
(Enter your password when prompted)

3. Create database:
```sql
CREATE DATABASE choce_moments;
SHOW DATABASES;
EXIT;
```

### Using MySQL Workbench (GUI)

1. Download from: https://dev.mysql.com/downloads/workbench/
2. Install and open MySQL Workbench
3. Connect to local MySQL server
4. Right-click on Schemas → Create Schema
5. Name: `choce_moments`
6. Click Apply

---

## Verify Database Connection

### Test 1: Direct MySQL Connection
```powershell
mysql -u root -e "SELECT 1;"
```
Expected output: `1` (connected successfully)

### Test 2: Connect with Password
```powershell
mysql -u root -p -e "SELECT 1;"
```

### Test 3: Show Databases
```powershell
mysql -u root -e "SHOW DATABASES;"
```
You should see `choce_moments` in the list

---

## Update `.env` File

Once MySQL is running, update `backend/.env`:

```env
# If no password on root user:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=choce_moments

# If password is set:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=choce_moments
```

---

## Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
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

## Troubleshooting

### MySQL Service Won't Start
```powershell
# Check if service exists
Get-Service MySQL80

# Stop service
net stop MySQL80

# Start service
net start MySQL80
```

### Connection Refused Error
- Make sure MySQL is running: `net start MySQL80`
- Check port 3306 is not blocked: `netstat -an | findstr 3306`
- Verify credentials in `.env`

### 'mysql' Command Not Found
- Add MySQL bin to PATH:
```powershell
$env:Path += ';C:\Program Files\MySQL\MySQL Server 8.0\bin'
```

### Database Already Exists
```sql
DROP DATABASE choce_moments;
CREATE DATABASE choce_moments;
```

---

## Important: For Development

**DON'T set a password on root** for local development to keep things simple.

If you already set a password, run:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
```

---

## Next Steps

1. Ensure MySQL is running
2. Update `.env` with correct credentials
3. Run: `npm run dev`
4. Test with Postman collection
5. Start building!

---

**Need Help?** Check MySQL official docs: https://dev.mysql.com/doc/
