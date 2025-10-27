# Microsoft 365 Admin Assistant Agent

An intelligent Microsoft 365 administrator assistant powered by AI with chain of thought reasoning capabilities. This agent helps M365 administrators with user management, security compliance, troubleshooting, and policy management tasks.

## 🚀 Features

### Chain of Thought Reasoning
- **Understanding**: Agent clearly restates what you're asking
- **Analysis**: Breaks down problems into key components  
- **Planning**: Outlines systematic steps to address requests
- **Execution**: Provides detailed solutions with reasoning
- **Verification**: Suggests validation methods for outcomes

### M365 Administration Capabilities

#### 👥 User Management
- User provisioning and account creation
- License assignment and management
- Password and security policies
- User offboarding procedures
- Group membership management

#### 🔒 Security & Compliance
- Security alert investigation
- Data Loss Prevention (DLP) policy management
- Compliance monitoring and reporting
- Incident response procedures
- Risk assessment and mitigation

#### 🛠️ Troubleshooting
- Email delivery issues
- SharePoint access problems
- Teams collaboration issues
- Performance optimization
- License and billing problems

#### 📋 Policy Management
- Conditional Access policies
- Exchange transport rules
- Azure AD configurations
- Information protection policies
- Retention and archive policies

## 💬 Example Interactions

### User Management Example
**User:** "How do I create a new user account for our marketing department?"

**Agent Response:**
```
🧠 Analysis
Understanding: You need to provision a new user account for someone joining the marketing department.

Analysis: This involves user creation, license assignment, group memberships, and security configuration.

Planning: 1) Create account with proper naming convention, 2) Assign appropriate licenses, 3) Add to marketing groups, 4) Configure security settings

Reasoning: Following proper provisioning procedures ensures security compliance and consistent user experience.

💡 Solution
Here's the step-by-step process for creating a marketing department user:

1. **Account Creation**
   - Use naming convention: firstname.lastname@company.com
   - Set temporary password requiring change at first login
   - Configure user profile with department information

2. **License Assignment**
   - Assign Microsoft 365 Business Premium or E3 license
   - Enable necessary services (Exchange, SharePoint, Teams)
   - Consider Power Platform licenses if needed

[Continue with detailed steps...]
```

### Security Investigation Example
**User:** "We received a security alert about suspicious login activity. How should I investigate?"

**Agent Response:**
```
🧠 Analysis
Understanding: You have a security alert indicating potential unauthorized access attempts.

Analysis: This requires immediate assessment of threat level, scope determination, and containment planning.

Planning: 1) Validate alert legitimacy, 2) Assess impact scope, 3) Implement containment, 4) Conduct investigation

Reasoning: Rapid response minimizes potential damage while systematic investigation ensures thoroughness.

💡 Solution
Immediate Security Alert Investigation Process:

🚨 **IMMEDIATE ACTIONS (0-15 minutes)**
1. **Validate Alert**
   - Check Microsoft 365 Security Center
   - Review sign-in logs in Azure AD
   - Verify if user is legitimate vs. compromised

[Continue with detailed investigation steps...]
```

## 🏗️ Architecture

### Components
- **Main App** (`src/app/app.ts`): Core message processing and chain of thought logic
- **Data Source** (`src/app/myDataSource.ts`): M365 knowledge base management
- **Instructions** (`src/app/instructions.txt`): Agent behavior and response formatting
- **Configuration** (`src/app/agentConfig.ts`): Agent settings and capabilities
- **Knowledge Base** (`src/data/`): M365 administration guides and best practices

### Data Sources
- **M365_User_Management_Guide.md**: User lifecycle and management procedures
- **M365_Security_Compliance_Guide.md**: Security policies and compliance frameworks
- **M365_Admin_Troubleshooting_Guide.md**: Common issues and resolution procedures

## 🔧 Configuration

### Agent Settings (`agentConfig.ts`)
```typescript
export const agentConfig = {
  chainOfThought: {
    enabled: true,
    showReasoningProcess: true,
    maxReasoningSteps: 5
  },
  security: {
    logAdminActions: true,
    requireApproval: false // Set true for production
  },
  // ... additional settings
};
```

### Supported Task Types
- `userManagement`: Account creation, modification, licensing
- `securityInvestigation`: Alert analysis, incident response
- `troubleshooting`: Issue resolution, diagnostics
- `policyManagement`: DLP, Conditional Access, Exchange rules
- `licenseManagement`: Usage optimization, cost management

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or 22
- Microsoft 365 Admin credentials (for production use)
- Azure OpenAI or OpenAI API key

### Installation
```bash
npm install
```

### Development
```bash
npm run dev:teamsfx:testtool
```

### Testing in Microsoft 365 Agents Playground
```bash
npm run dev:teamsfx:launch-testtool
```

## 🔐 Security Considerations

### Production Deployment
1. **Authentication**: Configure proper Azure AD app registration
2. **Permissions**: Implement least-privilege access principles  
3. **Logging**: Enable comprehensive audit logging
4. **Approval Workflows**: Consider implementing approval gates for sensitive operations
5. **Data Protection**: Ensure all admin actions comply with organizational policies

### Compliance Features
- Audit logging for all admin interactions
- Citation tracking for knowledge base sources
- Task type classification for monitoring
- Conversation history management

## 📚 Knowledge Base Management

### Adding New Content
1. Create markdown files in `src/data/` directory
2. Follow the existing naming convention: `M365_[Topic]_Guide.md`
3. Include relevant keywords for search optimization
4. Structure content with clear headings and step-by-step procedures

### Content Guidelines
- Use clear, actionable language
- Include security considerations
- Provide validation steps
- Reference official Microsoft documentation
- Include common troubleshooting scenarios

## 🤝 Contributing

1. Follow TypeScript best practices
2. Update knowledge base content regularly
3. Test chain of thought responses thoroughly
4. Document configuration changes
5. Maintain security-first approach

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Related Resources

- [Microsoft 365 Admin Center](https://admin.microsoft.com)
- [Microsoft Graph API Documentation](https://docs.microsoft.com/graph)
- [Azure AD Documentation](https://docs.microsoft.com/azure/active-directory)
- [Microsoft 365 Security & Compliance](https://security.microsoft.com)