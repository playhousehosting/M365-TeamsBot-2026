# Microsoft 365 Security and Compliance Management

## Data Loss Prevention (DLP) Policies

### DLP Policy Framework
1. **Classification**
   - Identify sensitive data types (PII, PHI, Financial)
   - Use built-in sensitive information types
   - Create custom classifiers if needed

2. **Policy Scope**
   - **Exchange Online**: Email protection
   - **SharePoint Online**: Document protection  
   - **OneDrive**: Personal file protection
   - **Teams**: Chat and file sharing protection
   - **Endpoints**: Device-level protection

3. **Policy Actions**
   - **Block**: Prevent sharing of sensitive content
   - **Block with Override**: Allow with business justification
   - **Notify**: Alert users and admins
   - **Audit**: Log activities for review

### Common DLP Scenarios
- **Credit Card Numbers**: Block sharing, notify compliance team
- **Social Security Numbers**: Block all external sharing
- **Confidential Documents**: Require encryption, limit sharing
- **Personal Health Information**: Strict access controls

## Security Alerts Management

### Alert Categories
1. **High Priority**
   - Account compromise indicators
   - Unusual sign-in activities
   - Data exfiltration attempts
   - Malware detections

2. **Medium Priority**
   - Policy violations
   - Unusual user behaviors
   - Configuration changes

3. **Low Priority**
   - Informational alerts
   - Routine security events

### Alert Response Process
1. **Immediate Assessment** (0-15 minutes)
   - Validate alert legitimacy
   - Assess potential impact
   - Determine scope of incident

2. **Containment** (15-60 minutes)
   - Isolate affected systems
   - Disable compromised accounts
   - Block suspicious activities

3. **Investigation** (1-24 hours)
   - Analyze attack vectors
   - Identify root cause
   - Document findings

4. **Recovery** (24-72 hours)
   - Restore services safely
   - Implement additional controls
   - Monitor for recurring issues

## Compliance Management

### Retention Policies
- **Email Retention**: 7 years for financial institutions
- **Document Retention**: Varies by industry and regulation
- **Teams Messages**: Consider legal hold requirements
- **Audit Logs**: Maintain for compliance reporting

### eDiscovery Process
1. **Legal Hold**: Preserve relevant data
2. **Collection**: Gather responsive documents
3. **Processing**: Remove duplicates, filter content
4. **Review**: Analyze for privilege and relevance
5. **Production**: Deliver to requesting parties

### Compliance Monitoring
- Regular compliance assessments
- Audit trail maintenance
- Policy effectiveness reviews
- Risk mitigation tracking

## Security Best Practices

### Identity Protection
- Implement Conditional Access policies
- Use Privileged Identity Management (PIM)
- Enable Identity Protection risk policies
- Regular access reviews

### Information Protection
- Classify and label sensitive data
- Implement Azure Information Protection
- Use Microsoft Cloud App Security
- Monitor data sharing activities

### Device Management
- Enroll devices in Intune
- Implement device compliance policies
- Use mobile application management
- Regular security updates