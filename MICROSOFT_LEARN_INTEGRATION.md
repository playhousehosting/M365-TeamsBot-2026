# Microsoft Learn MCP Integration

## Overview

Your M365 Admin Assistant now has access to **live Microsoft Learn documentation** through the Model Context Protocol (MCP). This ensures your bot always provides the most up-to-date information from official Microsoft sources.

## How It Works

### 1. **Dual-Source Knowledge**
- **Local Knowledge Base**: Your curated M365 admin guides (`src/data/`)
- **Microsoft Learn**: Real-time documentation from Microsoft's official sources

### 2. **Intelligent Query Routing**
The bot automatically:
- Searches your local knowledge base for immediate context
- Queries Microsoft Learn for the latest official documentation
- Combines both sources for comprehensive, current answers

### 3. **Query Flow**
```
User Question
    ↓
Local Knowledge Base Search (fast)
    ↓
Microsoft Learn MCP Query (authoritative)
    ↓
Combined Context → GPT-4o
    ↓
Enhanced Answer with Citations
```

## Features

### ✅ **Always Current**
- Real-time access to Microsoft Learn documentation
- Automatic updates when Microsoft releases new guidance
- No need to manually update local files for official docs

### ✅ **Best of Both Worlds**
- **Local**: Your organization's specific procedures and customizations
- **Microsoft Learn**: Official Microsoft best practices and latest features

### ✅ **Smart Integration**
- Automatically detects M365/Azure queries
- Only queries Microsoft Learn for relevant topics
- Caches results to minimize API calls

## MCP Tools Available

### `microsoft_docs_search`
Searches Microsoft Learn documentation and returns relevant content chunks.

**Example Usage in Bot:**
```typescript
// Automatically called when processing M365 queries
const results = await queryMicrosoftLearn("How to configure DLP policies");
```

### `microsoft_docs_fetch`
Fetches complete articles from Microsoft Learn for detailed information.

### `microsoft_code_sample_search`
Finds official code samples for PowerShell, Graph API, etc.

## Configuration

### Enable/Disable Microsoft Learn

The integration is **enabled by default**. To disable:

```typescript
// In src/app/app.ts
const ENABLE_MICROSOFT_LEARN = false; // Set to false to disable
```

### MCP Server Configuration

The Microsoft Learn MCP is configured in your VS Code settings. To verify:

1. Open VS Code Settings (JSON)
2. Look for `"mcp.servers"` section
3. Confirm `microsoft-doc` server is configured

## Examples

### Query: "How do I create a Conditional Access policy?"

**Response includes:**
1. **Local Knowledge**: Your organization's policy templates
2. **Microsoft Learn**: Latest Azure AD Conditional Access documentation
3. **Combined Answer**: Step-by-step guidance with official references

### Query: "What's new in Microsoft Intune?"

**Response prioritizes:**
- Microsoft Learn for latest features and updates
- Your local guides for organizational deployment procedures

## Benefits

### 🎯 **Accuracy**
Official Microsoft documentation ensures correct, supported procedures

### ⚡ **Speed**
Local cache + MCP = Fast responses with current information

### 📚 **Comprehensive**
Local expertise + Microsoft's knowledge base = Complete answers

### 🔄 **Self-Updating**
No manual documentation updates needed for Microsoft features

## Troubleshooting

### Microsoft Learn queries not working?

1. **Check MCP Server Status**
   ```powershell
   # Verify MCP tools are available
   # Look for microsoft-doc tools in the console
   ```

2. **Verify Internet Connection**
   Microsoft Learn queries require internet access

3. **Check Console Logs**
   ```
   [Microsoft Learn MCP] Querying documentation for: <query>
   [Microsoft Learn MCP] Added X documentation sources
   ```

### Performance Optimization

- Microsoft Learn queries add ~1-2 seconds per request
- Results are contextual and only fetched for M365-specific queries
- Local knowledge base is always searched first for speed

## Future Enhancements

- [ ] Caching layer for frequently asked Microsoft Learn queries
- [ ] Automatic relevance scoring between local and Microsoft Learn results
- [ ] PowerShell script examples from Microsoft Learn
- [ ] Graph API code snippets integration

## Related Files

- `src/app/app.ts` - Main integration logic
- `src/app/microsoftLearnService.ts` - MCP service wrapper
- `src/app/enhancedDataSource.ts` - Dual-source data handler

---

Your M365 Admin Assistant now has the power of Microsoft Learn at its fingertips! 🚀
