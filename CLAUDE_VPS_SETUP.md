# Claude Code VPS - Secured Setup Complete

## 🔐 Security Configuration

Your Azure VPS is now **secured and restricted to your IP only**: `147.235.196.83`

### VM Details
- **Name**: claude-vm
- **Resource Group**: vm
- **Public IP**: 20.217.222.124
- **OS**: Ubuntu 22.04 LTS
- **Size**: Standard_B2s
- **Node.js**: v20.19.4
- **Claude Code**: v1.0.89

### 🛡️ Security Layers Implemented

#### 1. Azure Network Security Group (NSG) Rules:
- ✅ SSH (port 22): **ALLOW only from 147.235.196.83**
- ✅ Web Terminal (port 8080): **ALLOW only from 147.235.196.83**  
- ✅ All other SSH attempts: **EXPLICITLY DENIED**

#### 2. VM Internal Firewall (UFW):
- ✅ SSH from your IP: **ALLOWED**
- ✅ Web terminal from your IP: **ALLOWED**
- ✅ All other IPs: **DENIED**
- ✅ Default policy: **DENY incoming, ALLOW outgoing**

### 📱 Access Methods

#### From Laptop/Computer:
```bash
ssh azureuser@20.217.222.124
```

#### From iPhone/Mobile:
1. **SSH App (Recommended)**: 
   - Install "Termius" or "SSH Files"
   - Server: 20.217.222.124
   - Username: azureuser
   - Use SSH key authentication

2. **Web Browser**:
   - URL: http://20.217.222.124:8080
   - Works on Safari, Chrome, any browser

### 🚀 Using Claude Code

Once connected:
```bash
# First time setup
claude auth login

# Start coding
claude

# Check version
claude --version
```

### 🔒 Security Status

- ✅ **IP Restriction**: Only your IP (147.235.196.83) can access
- ✅ **Dual Firewall**: Both Azure NSG and VM UFW configured
- ✅ **SSH Key Auth**: Password authentication disabled
- ✅ **Web Terminal**: Secured to your IP only
- ✅ **Service Monitoring**: ttyd service runs automatically

### ⚠️ Important Notes

1. **IP Changes**: If your public IP changes, you'll need to update the rules:
   ```bash
   # Get new IP
   curl ifconfig.me
   
   # Update NSG rule
   az network nsg rule update --resource-group vm --nsg-name claude-vmNSG --name default-allow-ssh --source-address-prefixes NEW_IP/32
   az network nsg rule update --resource-group vm --nsg-name claude-vmNSG --name allow-web-terminal-myip --source-address-prefixes NEW_IP/32
   
   # Update VM firewall
   ssh azureuser@20.217.222.124 'sudo ufw delete allow from OLD_IP && sudo ufw allow from NEW_IP to any port 22 && sudo ufw allow from NEW_IP to any port 8080'
   ```

2. **Cost Management**: 
   - VM costs ~$15-20/month for Standard_B2s
   - Stop VM when not in use: `az vm deallocate --resource-group vm --name claude-vm`
   - Start when needed: `az vm start --resource-group vm --name claude-vm`

3. **Backup**: Consider setting up automated backups for your work

### 🎯 Quick Test

Test access right now:
```bash
ssh azureuser@20.217.222.124 'claude --version'
```

Your VPS is now **completely secured** and ready for Claude Code development from anywhere! 🚀