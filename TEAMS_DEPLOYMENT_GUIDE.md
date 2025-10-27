# 📦 Teams Deployment Guide - M365 Admin Assistant

## ✅ **Package Created Successfully!**

Your M365 Admin Assistant is now packaged and ready for Teams upload!

**Package Location**: `c:\Users\kmccain\AgentsToolkitProjects\kam-test\appPackage\M365-Admin-Assistant.zip`

## 🚀 **How to Upload to Teams**

### **Step 1: Upload to Teams Admin Center** 

1. **Go to Teams Admin Center**
   - Open [https://admin.teams.microsoft.com](https://admin.teams.microsoft.com)
   - Sign in with your admin account

2. **Navigate to Apps**
   - Go to **Teams apps** → **Manage apps**
   - Click **Upload new app**

3. **Upload Package**
   - Click **Upload** and select `M365-Admin-Assistant.zip`
   - Review the app details
   - Click **Submit**

### **Step 2: Configure Bot Registration (Required)**

⚠️ **IMPORTANT**: You need to create a Bot Registration first:

1. **Azure Portal**
   - Go to [https://portal.azure.com](https://portal.azure.com)
   - Search for "Bot Services"
   - Click **Create** → **Azure Bot**

2. **Bot Configuration**
   - **Name**: M365-Admin-Assistant
   - **Resource Group**: Create new or use existing
   - **Pricing Tier**: F0 (Free)
   - **Bot Handle**: m365-admin-assistant (unique)
   - **Microsoft App ID**: Create new

3. **Get Bot Details**
   - After creation, note the **App ID** 
   - Go to **Configuration** → **Settings**
   - Note the **Microsoft App ID**

4. **Update Manifest**
   - Edit `manifest-ready.json`
   - Replace `12345678-1234-5678-9abc-123456789012` with your actual Bot ID
   - Repackage the ZIP file

### **Step 3: Configure Messaging Endpoint**

1. **In Azure Bot Settings**
   - Set **Messaging endpoint**: `https://your-bot-url.com/api/messages`
   - For development: Use ngrok or similar tunneling service

2. **Enable Teams Channel**
   - Go to **Channels** 
   - Click **Microsoft Teams**
   - Click **Apply**

### **Step 4: Deploy Your Bot Service**

You have several options:

#### **Option A: Azure App Service (Recommended)**
```bash
# Deploy to Azure App Service
az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name m365-admin-bot --runtime "node|18-lts"
```

#### **Option B: Local Development with ngrok**
```bash
# Install ngrok
npm install -g ngrok

# Start your bot locally
npm run dev

# In another terminal, expose it
ngrok http 3978
```

#### **Option C: Azure Container Instances**
```bash
# Build and deploy as container
docker build -t m365-admin-assistant .
# Deploy to ACI
```

## 🔧 **Environment Variables for Production**

Make sure your deployed bot has these environment variables:

```env
CLIENT_ID=your-bot-app-id
CLIENT_SECRET=your-bot-app-secret  
OPENAI_API_KEY=your-openai-key
BOT_TYPE=MultiTenant
```

## 📋 **Testing Your Deployment**

1. **In Teams Admin Center**
   - Find your uploaded app
   - Test it in the test environment

2. **Add to Teams**
   - Go to Teams client
   - Search for "M365 Admin Assistant"
   - Click **Add**
   - Start chatting!

## 🛠️ **Quick Commands to Test**

Once deployed, try these in Teams:

- `test` - Check system status
- `hello` - Basic greeting
- `How do I create a user account?` - Full chain of thought demo

## 🚨 **Common Issues & Solutions**

### **Issue: Bot not responding**
- Check messaging endpoint URL
- Verify environment variables
- Check Azure Bot logs

### **Issue: "App not found"**
- Verify Bot ID in manifest matches Azure Bot
- Check app is approved in Admin Center

### **Issue: Authentication errors**
- Verify CLIENT_ID and CLIENT_SECRET
- Check Bot Framework registration

## 📞 **Need Help?**

If you encounter issues:
1. Check Azure Bot logs in Application Insights
2. Verify all environment variables are set
3. Test the bot endpoint directly
4. Check Teams Admin Center for app status

Your M365 Admin Assistant is ready to help your team with expert Microsoft 365 administration! 🎉