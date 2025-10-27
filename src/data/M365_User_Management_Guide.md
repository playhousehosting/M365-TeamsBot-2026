# Microsoft 365 User Management Best Practices

## User Lifecycle Management

### User Creation Process
1. **Planning Phase**
   - Determine required licenses (E3, E5, Business Premium)
   - Identify necessary security groups and distribution lists
   - Plan directory synchronization if using hybrid setup

2. **Account Creation**
   - Use consistent naming conventions (firstname.lastname@domain.com)
   - Set appropriate user principal name (UPN)
   - Configure initial password policy compliance
   - Assign appropriate licenses immediately

3. **Security Configuration**
   - Enable multi-factor authentication (MFA)
   - Assign to appropriate security groups
   - Configure conditional access policies
   - Set up privileged identity management if needed

### User Modification Guidelines
- **License Changes**: Always verify compatibility before changing licenses
- **Group Membership**: Use security groups for permissions, distribution lists for communication
- **Profile Updates**: Maintain accurate contact information for security purposes

### User Offboarding Process
1. **Immediate Actions** (Day 0)
   - Disable user account
   - Revoke all sessions and tokens
   - Remove from sensitive security groups
   
2. **Data Management** (Days 1-7)
   - Convert mailbox to shared mailbox or assign to manager
   - Transfer OneDrive ownership
   - Review and transfer SharePoint permissions
   
3. **Cleanup** (Days 8-30)
   - Remove licenses to avoid costs
   - Archive or delete user data per retention policies
   - Update emergency contact lists

## Security Groups vs Distribution Lists

### Security Groups
- **Purpose**: Control access to resources
- **Scope**: Can be used for both security and distribution
- **Best Practice**: Use for SharePoint sites, Teams, and resource access

### Distribution Lists
- **Purpose**: Email distribution only
- **Scope**: Email communication
- **Best Practice**: Use for departmental communications, project updates

## Common Admin Tasks

### Password Management
- Enforce strong password policies
- Implement self-service password reset
- Monitor for compromised credentials
- Regular password policy reviews

### License Management
- Regular license usage audits
- Optimize license assignments
- Plan for seasonal workforce changes
- Monitor license compliance

### Compliance Considerations
- Maintain audit logs for user changes
- Document administrative actions
- Follow data retention policies
- Ensure GDPR/regulatory compliance