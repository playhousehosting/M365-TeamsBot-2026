import { App } from "@microsoft/teams.apps";
import { ChatPrompt } from "@microsoft/teams.ai";
import { LocalStorage } from "@microsoft/teams.common";
import { OpenAIChatModel } from "@microsoft/teams.openai";
import { MessageActivity, TokenCredentials } from '@microsoft/teams.api';
import { ManagedIdentityCredential } from '@azure/identity';
import * as fs from 'fs';
import * as path from 'path';
import config from "../config";
import { MyDataSource } from "./myDataSource";
import agentConfig from "./agentConfig";

// Create storage for conversation history
const storage = new LocalStorage();

// Initialize the standalone data source
const dataSource = new MyDataSource("company-knowledge");
dataSource.init();

// Microsoft Learn MCP integration helper
async function queryMicrosoftLearn(query: string): Promise<{content: string; sources: string[]}> {
  try {
    console.log(`[Microsoft Learn MCP] Querying documentation for: ${query}`);
    
    // Note: This function would be called by the MCP server if available
    // For now it's a placeholder that shows the integration pattern
    // The actual MCP tools would be invoked here when the bot runs
    
    return {
      content: '',
      sources: []
    };
  } catch (error) {
    console.error('[Microsoft Learn MCP] Query failed:', error);
    return {
      content: '',
      sources: []
    };
  }
}

// Load instructions from file on initialization
function loadInstructions(): string {
  const instructionPath = path.join(__dirname, 'instructions.txt');
  return fs.readFileSync(instructionPath, 'utf-8').trim();
}

// Load instructions once at startup
const instructions = loadInstructions();

// M365 Admin task detection patterns
const adminTaskPatterns = {
  userManagement: /\b(create|add|new|provision|setup)\s+(user|account|mailbox)\b/i,
  userModification: /\b(modify|update|change|edit)\s+(user|account|password|license)\b/i,
  userOffboarding: /\b(disable|delete|remove|offboard|deactivate)\s+(user|account)\b/i,
  groupManagement: /\b(create|add|manage|setup)\s+(group|distribution|security)\b/i,
  securityInvestigation: /\b(investigate|analyze|review|check)\s+(alert|incident|security|breach)\b/i,
  policyManagement: /\b(create|setup|configure|manage)\s+(policy|dlp|conditional|access)\b/i,
  troubleshooting: /\b(troubleshoot|fix|resolve|debug|error|issue|problem)\b/i,
  licenseManagement: /\b(license|licensing|subscription|assign|usage)\b/i
};

// Detect M365 admin task type
function detectAdminTaskType(query: string): string {
  for (const [taskType, pattern] of Object.entries(adminTaskPatterns)) {
    if (pattern.test(query)) {
      return taskType;
    }
  }
  return 'general';
}


const createTokenFactory = () => {
  return async (scope: string | string[], tenantId?: string): Promise<string> => {
    const managedIdentityCredential = new ManagedIdentityCredential({
        clientId: process.env.CLIENT_ID
      });
    const scopes = Array.isArray(scope) ? scope : [scope];
    const tokenResponse = await managedIdentityCredential.getToken(scopes, {
      tenantId: tenantId
    });
   
    return tokenResponse.token;
  };
};

// Configure authentication using TokenCredentials
const tokenCredentials: TokenCredentials = {
  clientId: process.env.CLIENT_ID || '',
  token: createTokenFactory()
};

const credentialOptions = config.MicrosoftAppType === "UserAssignedMsi" ? { ...tokenCredentials } : undefined;

const app = new App({
  ...credentialOptions,
  storage
});


// Handle incoming messages
app.on('message', async ({ send, activity }) => {
  //Get conversation history
  const conversationKey = `${activity.conversation.id}/${activity.from.id}`;
  const messages = storage.get(conversationKey) || [];
  
  // Detect admin task type for better context
  const taskType = detectAdminTaskType(activity.text);

  // Handle test/health check messages
  if (activity.text.toLowerCase().includes('test') || activity.text.toLowerCase().includes('health') || activity.text.toLowerCase().includes('ping')) {
    const status = `🟢 **M365 Admin Assistant Status**

✅ Agent is running with **${config.openAIModelName}**
✅ Task detection working: **${taskType}**
✅ Knowledge base loaded: **${dataSource.getAllDocuments().length} documents**
✅ Chain of thought reasoning: **Enabled**
✅ OpenAI API Key: **${config.openAIKey ? 'Configured (' + config.openAIKey.substring(0, 10) + '...)' : 'NOT SET'}**

**Available Admin Domains:**
- User Management
- Security & Compliance  
- Troubleshooting
- Policy Management
- License Management

Try asking: *"How do I create a new user account?"*`;
    
    await send(status);
    return;
  }

  // Handle simple hello/greetings without AI to test basic functionality
  if (activity.text.toLowerCase().includes('hello') || activity.text.toLowerCase().includes('hi')) {
    await send(`👋 **Hello! I'm your M365 Admin Assistant**

I'm here to help with Microsoft 365 administration tasks using advanced chain of thought reasoning.

**Quick Commands:**
- Type **"test"** to check system status
- Ask about user management: *"How do I create a user?"*
- Ask about security: *"How do I investigate an alert?"*
- Ask about troubleshooting: *"User can't access SharePoint"*

**Detected Task Type:** ${taskType}

What M365 admin task can I help you with today?`);
    return;
  }

  try {
    // Check if OpenAI API key is configured
    if (!config.openAIKey) {
      console.error('OpenAI API key is not configured');
      await send('🔧 **Configuration Error**: OpenAI API key is not set. Please configure your API key in the environment variables.');
      return;
    }
    
    // Get relevant context from the data source
    const contextData = dataSource.renderContext(activity.text);
    
    // Query Microsoft Learn for latest documentation (async enhancement)
    const microsoftLearnData = await queryMicrosoftLearn(activity.text);
    
    // Build enhanced instructions that include context and task-specific guidance
    let enhancedInstructions = instructions;
    
    // Add task-specific guidance
    switch (taskType) {
      case 'userManagement':
        enhancedInstructions += `\n\n## Current Task Context: User Management\nFocus on user provisioning best practices, security considerations, and compliance requirements.`;
        break;
      case 'securityInvestigation':
        enhancedInstructions += `\n\n## Current Task Context: Security Investigation\nEmphasize threat analysis, incident response procedures, and forensic considerations.`;
        break;
      case 'troubleshooting':
        enhancedInstructions += `\n\n## Current Task Context: Troubleshooting\nProvide systematic diagnostic steps, common causes, and verification methods.`;
        break;
      case 'policyManagement':
        enhancedInstructions += `\n\n## Current Task Context: Policy Management\nFocus on policy scope, impact analysis, and rollback procedures.`;
        break;
    }
    
    // Add local knowledge base context
    if (contextData.content) {
      enhancedInstructions += `\n\n## Knowledge Base Context (Sources: ${contextData.sources.join(', ')})\n${contextData.content}`;
    }
    
    // Add Microsoft Learn context if available
    if (microsoftLearnData.content) {
      enhancedInstructions += `\n\n## Latest Microsoft Learn Documentation\n${microsoftLearnData.content}\n\n**Note**: This information is from the latest Microsoft Learn documentation and represents current best practices.`;
      console.log(`[Microsoft Learn] Added ${microsoftLearnData.sources.length} documentation sources`);
    }

    let prompt;
    let modelToUse = config.openAIModelName;
    
    try {
      prompt = new ChatPrompt({
        messages,
        instructions: enhancedInstructions,
        model: new OpenAIChatModel({
          model: modelToUse,
          apiKey: config.openAIKey
        })
      });
      console.log(`ChatPrompt created successfully with ${modelToUse}`);
    } catch (modelError) {
      console.error(`Error creating ChatPrompt with ${modelToUse}:`, modelError);
      
      // Fallback to GPT-3.5-turbo if GPT-4 isn't available
      if (modelToUse !== "gpt-3.5-turbo") {
        console.log('Attempting fallback to gpt-3.5-turbo');
        try {
          modelToUse = "gpt-3.5-turbo";
          prompt = new ChatPrompt({
            messages,
            instructions: enhancedInstructions,
            model: new OpenAIChatModel({
              model: modelToUse,
              apiKey: config.openAIKey
            })
          });
          console.log(`Successfully fell back to ${modelToUse}`);
        } catch (fallbackError) {
          console.error('Fallback model also failed:', fallbackError);
          await send(`🚨 **Model Access Error**\n\nYour OpenAI project doesn't have access to GPT-4 or GPT-3.5-turbo.\n\nPlease check your OpenAI account permissions or upgrade your plan.\n\nError: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`);
          return;
        }
      } else {
        await send(`🚨 **Model Configuration Error**\n\nFailed to initialize ${modelToUse}:\n${modelError instanceof Error ? modelError.message : 'Unknown error'}`);
        return;
      }
    }

    console.log(`Sending request to ${config.openAIModelName} with ${enhancedInstructions.length} characters of instructions`);
    
    // For debugging, let's try a simpler prompt first if the user asks for "simple"
    if (activity.text.toLowerCase().includes('simple')) {
      const simplePrompt = new ChatPrompt({
        messages: [],
        instructions: "You are a helpful M365 administrator. Answer this question briefly: " + activity.text,
        model: new OpenAIChatModel({
          model: config.openAIModelName,
          apiKey: config.openAIKey
        })
      });
      
      const simpleResponse = await simplePrompt.send(activity.text);
      await send(`🧪 **Simple Response Test**\n\n${simpleResponse.content}`);
      return;
    }
    
    const response = await prompt.send(activity.text);
    
    console.log(`Received response of ${response.content.length} characters`);
    
    // Create response with AI generated indicator and add citations if we used context
    let result = null;
    let isValidJson = false;
    
    try {
      // Try to clean up the response before parsing
      let cleanContent = response.content.trim();
      
      // Remove potential markdown code block formatting
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/, '').replace(/\s*```$/, '');
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\s*/, '').replace(/\s*```$/, '');
      }
      
      result = JSON.parse(cleanContent);
      isValidJson = true;
      console.log('Successfully parsed JSON response');
    } catch (error) {
      console.error(`Response is not valid JSON, using fallback formatting. Error: ${error}`);
      console.log(`Raw response (first 500 chars): ${response.content.substring(0, 500)}`);
      
      // Create a fallback structured response
      result = {
        results: [{
          thought_process: {
            understanding: `Processing your M365 admin request: "${activity.text}"`,
            analysis: "Analyzing the requirements using available knowledge base",
            planning: "Preparing step-by-step guidance based on M365 best practices",
            reasoning: "Using structured approach for M365 administration tasks",
            verification: "Suggesting validation methods for the proposed solution"
          },
          answer: response.content || "I understand you're asking about M365 administration. Let me provide some general guidance while we resolve the technical issue.",
          citationTitle: contextData.sources.length > 0 ? contextData.sources[0] : "M365 Knowledge Base",
          citationContent: contextData.sources.length > 0 ? "Information from M365 administration guides" : ""
        }]
      };
    }

    // Process chain of thought responses with citations
    const citations: any[] = [];
    let position = 1;
    let content = "";

    if (result && result.results && result.results.length > 0) {
      result.results.forEach((contentItem: any) => {
        // Format enhanced chain of thought response with better readability
        let formattedAnswer = "";
        
        if (contentItem.thought_process) {
          formattedAnswer += "## 🧠 Advanced Reasoning Process\n\n";
          formattedAnswer += `### 🎯 Understanding\n${contentItem.thought_process.understanding}\n\n`;
          formattedAnswer += `---\n\n`;
          formattedAnswer += `### 🔍 Analysis\n${contentItem.thought_process.analysis}\n\n`;
          formattedAnswer += `---\n\n`;
          formattedAnswer += `### 📋 Planning\n${contentItem.thought_process.planning}\n\n`;
          formattedAnswer += `---\n\n`;
          formattedAnswer += `### 💭 Reasoning\n${contentItem.thought_process.reasoning}\n\n`;
          if (contentItem.thought_process.verification) {
            formattedAnswer += `---\n\n`;
            formattedAnswer += `### ✅ Verification\n${contentItem.thought_process.verification}\n\n`;
          }
          formattedAnswer += `---\n\n`;
          formattedAnswer += "## 💡 Comprehensive Solution\n\n";
        }
        
        formattedAnswer += contentItem.answer;
        
        if (contentItem.citationTitle && contentItem.citationTitle.trim() !== "") {
          const citation = {
            name: contentItem.citationTitle || `M365 Admin Guide #${position}`,
            abstract: contentItem.citationContent ?? `Information from ${contentItem.citationTitle}`,
          };
          
          formattedAnswer += `[${position}]`;
          
          position++;
          citations.push(citation);
        }
        
        content += formattedAnswer + "<br><br>";
      });
    }
    
    const responseActivity = new MessageActivity(content).addAiGenerated();
    
    // Add citations from parsed response or fallback to context sources
    if (citations.length > 0) {
      citations.forEach((citation, index) => {
        responseActivity.addCitation(index + 1, {
          name: citation.name,
          abstract: `${citation.abstract}`
        });
      });
    } 
    
    await send(responseActivity);
    
    // Update conversation history with task context
    messages.push(
      { role: 'user', content: activity.text },
      { role: 'assistant', content: content, taskType: taskType }
    );
    
    // Limit conversation history to last 10 exchanges to prevent context overflow
    if (messages.length > 20) {
      messages.splice(0, messages.length - 20);
    }
    
    storage.set(conversationKey, messages);

  } catch (error) {
    console.error('Error processing message:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Log admin action if security logging is enabled
    if (agentConfig.security.logAdminActions) {
      console.log(`[ADMIN LOG] ${new Date().toISOString()} - Error in task: ${taskType}, User: ${activity.from.id}, Query: ${activity.text.substring(0, 100)}`);
    }
    
    // Provide a helpful error message with troubleshooting steps
    const errorMessage = `🚨 **System Error Detected**

I encountered an issue while processing your request. Here are some troubleshooting steps:

**For Administrators:**
1. Check if OpenAI API key is properly configured
2. Verify network connectivity to OpenAI services
3. Review server logs for detailed error information

**User Options:**
- Try rephrasing your question in simpler terms
- Ask one question at a time
- Contact your IT administrator if the issue continues

**Task Type Detected:** ${taskType}
**Error Details:** ${error instanceof Error ? error.message : 'Unknown error'}`;

    await send(errorMessage);
  }
});

export default app;