# 🚀 Quick Setup Guide

This guide will help you get the M365 Admin Assistant Bot running in minutes.

## Prerequisites Checklist

- [ ] Node.js 20 or 22 installed ([Download](https://nodejs.org/))
- [ ] VS Code with Microsoft 365 Agents Toolkit extension ([Install](https://aka.ms/teams-toolkit))
- [ ] OpenAI API key ([Get one](https://platform.openai.com/api-keys))
- [ ] Git installed (for cloning the repository)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/playhousehosting/M365-TeamsBot-2026.git
cd M365-TeamsBot-2026
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Your OpenAI API Key

#### For Playground Testing (Recommended First Step):

1. Copy the sample environment file:
   ```bash
   cp env/.env.playground.user.sample env/.env.playground.user
   ```

2. Edit `env/.env.playground.user`:
   ```bash
   SECRET_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

#### For Local Teams Development:

1. Copy the sample environment file:
   ```bash
   cp env/.env.local.user.sample env/.env.local.user
   ```

2. Edit `env/.env.local.user`:
   ```bash
   SECRET_OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   ```

#### For Azure Production Deployment:

1. Copy the sample environment file:
   ```bash
   cp env/.env.dev.user.sample env/.env.dev.user
   ```

2. Edit `env/.env.dev.user` with your Azure and OpenAI credentials

### 4. Build the Project

```bash
npm run build
```

### 5. Start the Bot

#### Option A: Microsoft 365 Agents Playground (Easiest)

1. Open the project in VS Code
2. Press `F5` or click "Run and Debug"
3. Select "Start Agent in Microsoft 365 Agents Playground"
4. Wait for the playground to open in your browser
5. Start chatting!

**Test with these queries:**
- "How do I create a new user in M365?"
- "Show me how to configure Conditional Access"
- "Help me investigate a security alert"

#### Option B: Teams Desktop Client

1. In VS Code, open Command Palette (`Ctrl+Shift+P`)
2. Type "Teams: Start Agent Locally"
3. Follow the prompts to provision and deploy
4. Bot opens in Teams desktop client

#### Option C: Command Line

```bash
# For playground
npm run dev:teamsfx:testtool

# For local Teams
npm run dev:teamsfx
```

## Verification

### ✅ Successful Setup Checklist

- [ ] `npm install` completed without errors
- [ ] `npm run build` completed successfully
- [ ] Environment file created with valid OpenAI key
- [ ] Playground/Teams opened with the bot
- [ ] Bot responds to test messages
- [ ] Chain of thought reasoning is visible in responses

### 🔍 Troubleshooting

#### Problem: "OpenAI API key is not configured"
**Solution**: 
1. Verify `env/.env.playground.user` exists
2. Check that `SECRET_OPENAI_API_KEY` is set correctly
3. Restart the bot

#### Problem: Build errors
**Solution**:
```bash
# Clean and rebuild
npm run clean
npm install
npm run build
```

#### Problem: Port already in use
**Solution**:
```bash
# Kill process on port 3978
npx kill-port 3978

# Kill process on port 56150 (playground)
npx kill-port 56150
```

#### Problem: Bot not responding
**Solution**:
1. Check browser console for errors (F12)
2. Verify OpenAI API key is valid
3. Check rate limits on your OpenAI account
4. Review VS Code Debug Console output

## Next Steps

### Customize the Bot

1. **Add your own knowledge base**:
   - Create markdown files in `src/data/`
   - Run `npm run build`

2. **Adjust AI behavior**:
   - Edit `src/config.ts` to change temperature, max tokens
   - Edit `src/app/instructions.txt` to modify reasoning style

3. **Deploy to Azure**:
   - Follow the [Deployment Guide](TEAMS_DEPLOYMENT_GUIDE.md)
   - Configure Azure resources
   - Set up Application Insights

### Learn More

- **Understanding Chain of Thought**: See example responses in README
- **PowerShell Examples**: Check `src/data/` guides
- **Microsoft Learn Integration**: Read [MICROSOFT_LEARN_INTEGRATION.md](MICROSOFT_LEARN_INTEGRATION.md)
- **API Documentation**: [Teams AI Library V2](https://aka.ms/teams-ai-library-v2)

## Support

Need help? 
- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/playhousehosting/M365-TeamsBot-2026/issues)
- 💬 [Discussions](https://github.com/playhousehosting/M365-TeamsBot-2026/discussions)
- 📧 Email: randy@playhousehosting.com

## Security Reminders

- ⚠️ **Never commit `.env.*.user` files** - they contain your API keys
- 🔒 **Rotate API keys regularly** (every 90 days)
- 🛡️ **Use Azure Key Vault** for production deployments
- 👥 **Enable MFA** on admin accounts

---

**You're all set! Start asking your M365 Admin Assistant questions.** 🎉
