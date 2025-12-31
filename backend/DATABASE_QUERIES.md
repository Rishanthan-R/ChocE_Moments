# 🗄️ MySQL Database Query Reference

Quick SQL commands for checking your data while testing.

---

## 🔍 View All Users

```sql
-- See all users created
SELECT * FROM users;

-- See specific columns
SELECT id, name, email, phone, role, createdAt FROM users;

-- See with formatted output
SELECT id, name, email, phone, role, DATE_FORMAT(createdAt, '%Y-%m-%d %H:%i:%s') as createdAt FROM users;
```

---

## 👤 Check Specific User

```sql
-- By email
SELECT * FROM users WHERE email = 'test@example.com';

-- By name
SELECT * FROM users WHERE name = 'Test User';

-- Latest user
SELECT * FROM users ORDER BY createdAt DESC LIMIT 1;
```

---

## 📊 Database Statistics

```sql
-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Users created today
SELECT COUNT(*) FROM users WHERE DATE(createdAt) = CURDATE();

-- All users with signup date
SELECT id, name, email, DATE(createdAt) as signup_date FROM users ORDER BY createdAt DESC;
```

---

## ✏️ Update User (Testing Only)

```sql
-- Change user name
UPDATE users SET name = 'Updated Name' WHERE email = 'test@example.com';

-- Change user role to admin
UPDATE users SET role = 'admin' WHERE email = 'test@example.com';

-- Change user phone
UPDATE users SET phone = '0123456789' WHERE email = 'test@example.com';
```

---

## 🗑️ Delete User (Testing)

```sql
-- Delete specific user
DELETE FROM users WHERE email = 'test@example.com';

-- Delete all test users
DELETE FROM users WHERE email LIKE 'test%';

-- Delete all users (WARNING!)
DELETE FROM users;
```

---

## 📋 Table Structure

```sql
-- See table structure
DESCRIBE users;

-- See CREATE statement
SHOW CREATE TABLE users;

-- See table size
SELECT 
  TABLE_NAME, 
  ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as size_mb
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'choce_moments';
```

---

## 🔄 Verify Data After Testing

```sql
-- Check user created in database
SELECT * FROM users WHERE email = 'newtest@example.com';

-- Verify password is hashed (not plain text)
SELECT email, LENGTH(password) as password_length, SUBSTR(password, 1, 10) as password_prefix FROM users;

-- Check no sensitive data leaked
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'choce_moments' AND TABLE_NAME = 'users';
```

---

## 📍 Access via Command Line

### Windows PowerShell
```powershell
# Connect to MySQL
mysql -u root

# Select database
USE choce_moments;

# Run queries
SELECT * FROM users;

# Exit
EXIT;
```

### Direct Query
```powershell
# Single command
mysql -u root choce_moments -e "SELECT * FROM users;"

# With formatting
mysql -u root choce_moments -e "SELECT id, name, email, phone FROM users;" -t
```

---

## 📍 Access via phpMyAdmin

```
1. Open: http://localhost/phpmyadmin
2. Left sidebar: Click "choce_moments" database
3. Click "users" table
4. See all data in table view
5. Can edit directly from GUI
```

---

## ⚠️ Common Issues

### "Table doesn't exist"
```sql
-- Check tables in database
SHOW TABLES;

-- Should see: users table
-- If not: Backend creates it automatically when server starts
```

### "Connection refused"
```powershell
# XAMPP MySQL not running
# Go to XAMPP Control Panel and click "Start" for MySQL
```

### "Access denied"
```sql
-- Check user credentials in backend/.env
-- Default: 
-- DB_USER=root
-- DB_PASSWORD=(empty)
```

---

## 🧪 Test Data Commands

### Create Test User Via SQL
```sql
-- This won't work because password needs hashing!
-- Always use API signup instead

-- But this shows the schema:
INSERT INTO users (name, email, phone, address, password, role, createdAt, updatedAt) 
VALUES ('Test', 'test@example.com', '0706878899', 'Test Address', 'hashedpassword123', 'user', NOW(), NOW());
```

### Create Test User Via API
```powershell
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","email":"test@example.com","phone":"0706878899","address":"Test Address","password":"password123"}'
```

---

## 🔍 Database State Verification

### Before Testing
```sql
SELECT COUNT(*) FROM users;
-- Output: 0 (or 1 if you made test account)
```

### After Signup Test
```sql
SELECT COUNT(*) FROM users;
-- Output: 1 (should increase)

SELECT name, email FROM users ORDER BY createdAt DESC LIMIT 1;
-- Should see your new user
```

### After Login Test
```sql
-- Check password was created (don't display actual password!)
SELECT email, LENGTH(password) as pwd_length FROM users;
-- Password should be ~60 characters (bcryptjs hash)
```

---

## 💾 Backup Database

```powershell
# Export database to SQL file
mysqldump -u root choce_moments > choce_moments_backup.sql

# Restore from backup
mysql -u root choce_moments < choce_moments_backup.sql

# Export only user data
mysqldump -u root choce_moments users > users_backup.sql
```

---

## 🧹 Clean Database

```sql
-- Drop database completely
DROP DATABASE choce_moments;

-- Create fresh
CREATE DATABASE choce_moments;

-- Verify
SHOW DATABASES;
```

*Note: Backend will automatically create `users` table when it starts*

---

## 📊 Monitor Database Usage

```sql
-- Database size
SELECT sum(ROUND(((T.DATA_LENGTH+T.INDEX_LENGTH)/1024/1024),2)) FROM INFORMATION_SCHEMA.TABLES as T WHERE TABLE_SCHEMA = 'choce_moments';

-- User count
SELECT COUNT(*) as total_users, COUNT(DISTINCT DATE(createdAt)) as signup_days FROM users;

-- Last user signup
SELECT name, email, createdAt FROM users ORDER BY createdAt DESC LIMIT 1;
```

---

## 🔐 Verify Security

```sql
-- Check password hashing (should be ~60 chars for bcryptjs)
SELECT email, LENGTH(password) as password_hash_length FROM users;
-- All should be ~60 characters

-- Verify email is unique
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
-- Should return empty (no duplicates)

-- Check role assignment
SELECT role, COUNT(*) FROM users GROUP BY role;
-- Should show: user (your count), admin (0 or 1)
```

---

## 📝 SQL Cheat Sheet

| Command | Purpose |
|---------|---------|
| `USE choce_moments;` | Select database |
| `SHOW TABLES;` | List all tables |
| `DESCRIBE users;` | Show table structure |
| `SELECT * FROM users;` | View all users |
| `SELECT COUNT(*) FROM users;` | Count users |
| `SELECT * FROM users WHERE email = 'test@example.com';` | Find by email |
| `UPDATE users SET name = 'New' WHERE id = 1;` | Update user |
| `DELETE FROM users WHERE id = 1;` | Delete user |
| `TRUNCATE users;` | Delete all data (keeps table) |
| `DROP TABLE users;` | Delete entire table |

---

## 🚀 Quick Check Script

Copy and paste into MySQL:

```sql
-- Full database health check
USE choce_moments;

-- 1. Check table exists
SHOW TABLES;

-- 2. Check structure
DESCRIBE users;

-- 3. Count users
SELECT 'Total Users' as Check_Name, COUNT(*) as Value FROM users
UNION
-- 4. Check unique emails
SELECT 'Unique Emails', COUNT(DISTINCT email) FROM users
UNION
-- 5. Check roles
SELECT 'Admin Users', COUNT(*) FROM users WHERE role = 'admin'
UNION
-- 6. Check password hashing
SELECT 'Password Hash Length', AVG(LENGTH(password)) FROM users;
```

---

**Last Updated:** During Backend Implementation  
**Status:** Ready for Testing ✅
