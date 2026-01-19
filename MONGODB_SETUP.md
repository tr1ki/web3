# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Windows)

### Step 1: Download MongoDB
1. Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: Latest Stable Release
   - Platform: Windows x64
   - Package: msi
3. Download and run the installer

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. Select "Install MongoDB as a Service" (recommended)
4. Complete the installation

### Step 3: Start MongoDB
MongoDB should start automatically as a Windows service. You can verify:
- Open Services (services.msc)
- Look for "MongoDB Server"
- Status should be "Running"

### Step 4: Test Connection
Open Command Prompt and run:
```cmd
mongo
```
Or for newer versions:
```cmd
mongosh
```

## Option 2: Use MongoDB Atlas (Cloud - Free)

### Step 1: Create Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account

### Step 2: Create Cluster
1. Create a free cluster (M0 Sandbox)
2. Choose cloud provider and region closest to you
3. Wait for cluster to be provisioned

### Step 3: Configure Access
1. Go to "Network Access" section
2. Add your IP address (or allow access from anywhere: 0.0.0.0/0)
3. Go to "Database Access" section
4. Add a database user with read/write permissions

### Step 4: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your actual password

### Step 5: Update .env File
Replace the MONGODB_URI in your `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blogdb
```

## Verify Installation

After setting up MongoDB, restart your Node.js application:
```bash
npm run dev
```

You should see "Connected to MongoDB" in the console output.

## Troubleshooting

### Connection Issues
- Check if MongoDB service is running
- Verify firewall settings
- Ensure correct connection string
- Check MongoDB logs for errors

### Windows Service Problems
- Run Command Prompt as Administrator
- Try: `net start MongoDB`
- Or reinstall MongoDB with service option