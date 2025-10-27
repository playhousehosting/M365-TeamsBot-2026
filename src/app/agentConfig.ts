/**
 * M365 Admin Agent Configuration
 * This file contains configuration for the Microsoft 365 administrator assistant
 */

export const agentConfig = {
  // Agent identity and capabilities
  name: "M365 Admin Assistant",
  version: "1.0.0",
  description: "Expert Microsoft 365 administrator with chain of thought reasoning",
  
  // Supported admin domains
  supportedDomains: [
    "user-management",
    "security-compliance", 
    "exchange-administration",
    "sharepoint-administration",
    "teams-administration",
    "azure-ad-management",
    "license-management",
    "troubleshooting",
    "policy-management"
  ],

  // Chain of thought configuration
  chainOfThought: {
    enabled: true,
    showReasoningProcess: true,
    maxReasoningSteps: 7, // Increased for GPT-4o's enhanced reasoning
    includeValidationSteps: true
  },

  // Response formatting preferences
  responseFormat: {
    includeEmojis: true,
    useMarkdown: true,
    maxResponseLength: 3000, // Increased for more detailed responses
    includeCitations: true,
    showTaskType: true
  },

  // Security and compliance settings
  security: {
    logAdminActions: true,
    requireApproval: false, // Set to true for production environments
    sensitiveOperations: [
      "user-deletion",
      "policy-modification", 
      "security-investigation",
      "data-recovery"
    ]
  },

  // Integration endpoints (for future expansion)
  integrations: {
    microsoftGraph: {
      enabled: false, // Enable when authentication is configured
      scopes: [
        "User.Read.All",
        "Group.ReadWrite.All", 
        "Directory.Read.All",
        "Policy.Read.All"
      ]
    },
    azureAD: {
      enabled: false,
      tenantId: process.env.AZURE_TENANT_ID
    }
  },

  // Conversation management
  conversation: {
    maxHistoryLength: 20,
    enableTaskTracking: true,
    contextWindow: 4000
  }
};

export default agentConfig;