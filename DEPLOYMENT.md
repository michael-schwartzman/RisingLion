# RisingLion Game - Azure AKS Deployment Guide

This repository includes a complete CI/CD pipeline for deploying the RisingLion game to Azure Kubernetes Service (AKS) with multi-tenant support and PR staging environments.

## 🏗️ Architecture Overview

- **Container Registry:** Azure Container Registry (ACR)
- **Orchestration:** Azure Kubernetes Service (AKS)
- **Ingress:** NGINX Ingress Controller
- **CI/CD:** GitHub Actions
- **Multi-tenancy:** Namespace-based isolation

## 📋 Prerequisites

### Azure Resources
1. **Azure Container Registry (ACR)**
   - Name: `risinglionacr`
   - SKU: Basic or Standard
   - Admin access enabled

2. **Azure Kubernetes Service (AKS)**
   - Cluster name: `games-multi-tenancy`
   - Resource group: `RisingLionAKS`
   - Node pool: 2-3 nodes (Standard_B2s or higher)
   - Kubernetes version: 1.25+

3. **Azure Service Principal**
   - Contributor access to the AKS resource group
   - Push/Pull access to ACR

### GitHub Secrets Required

Add these secrets to your GitHub repository settings:

```bash
AZURE_CREDENTIALS='{
  "clientId": "your-service-principal-client-id",
  "clientSecret": "your-service-principal-client-secret",
  "subscriptionId": "your-azure-subscription-id",
  "tenantId": "your-azure-tenant-id"
}'
```

## 🚀 Deployment Workflows

### 1. Continuous Integration (`ci.yml`)
**Triggers:** Push/PR to main/develop branches

**Actions:**
- HTML/JavaScript syntax validation
- Docker build testing
- Kubernetes manifest validation
- Security scanning with Trivy

### 2. AKS Deployment (`deploy-aks.yml`)
**Triggers:** Push to main, PRs, manual dispatch

**Production Deployment (main branch):**
- Namespace: `risinglion`
- URL: `http://risinglion.games`
- Image tag: `latest-{commit-sha}`

**Staging Deployment (PR):**
- Namespace: `pr-{number}`
- URL: `http://games.risinglion.dev/pr-{number}`
- Image tag: `pr-{number}-{commit-sha}`

### 3. PR Preview Comments (`pr-preview.yml`)
**Triggers:** Successful deployment workflow completion

**Actions:**
- Posts/updates PR comment with preview URL
- Includes deployment details and testing checklist

### 4. Environment Cleanup (`cleanup-pr.yml`)
**Triggers:** PR closure (merged or closed)

**Actions:**
- Deletes PR-specific namespace
- Cleans up all associated resources

## 🔧 Setup Instructions

### 1. Azure Infrastructure Setup

```bash
# Login to Azure
az login

# Create resource group
az group create --name RisingLionAKS --location eastus

# Create ACR
az acr create --name risinglionacr --resource-group RisingLionAKS --sku Basic --admin-enabled true

# Create AKS cluster
az aks create \
  --resource-group RisingLionAKS \
  --name games-multi-tenancy \
  --node-count 2 \
  --node-vm-size Standard_B2s \
  --enable-addons monitoring \
  --generate-ssh-keys

# Connect AKS to ACR
az aks update --name games-multi-tenancy --resource-group RisingLionAKS --attach-acr risinglionacr

# Get AKS credentials
az aks get-credentials --resource-group RisingLionAKS --name games-multi-tenancy
```

### 2. Install NGINX Ingress Controller

```bash
# Install NGINX Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Wait for installation to complete
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=120s

# Get external IP
kubectl get service -n ingress-nginx
```

### 3. DNS Configuration

Configure your DNS records:
- `risinglion.games` → LoadBalancer external IP (production)
- `games.risinglion.dev` → LoadBalancer external IP (staging)

### 4. Service Principal Setup

```bash
# Create service principal
az ad sp create-for-rbac --name "risinglion-github-actions" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/RisingLionAKS --sdk-auth

# Grant ACR access
az role assignment create --assignee {service-principal-client-id} --scope /subscriptions/{subscription-id}/resourceGroups/RisingLionAKS/providers/Microsoft.ContainerRegistry/registries/risinglionacr --role AcrPush
```

## 🌐 Environment URLs

### Production
- **URL:** http://risinglion.games
- **Namespace:** `risinglion`
- **Deployment:** Automatic on push to `main`

### Staging (PR Previews)
- **URL Pattern:** `http://games.risinglion.dev/pr-{number}`
- **Namespace Pattern:** `pr-{number}`
- **Deployment:** Automatic on PR creation/update
- **Cleanup:** Automatic on PR closure

## 📊 Monitoring & Debugging

### View Deployments
```bash
# List all namespaces
kubectl get namespaces

# Check production deployment
kubectl get all -n risinglion

# Check specific PR deployment
kubectl get all -n pr-123

# View ingress status
kubectl get ingress --all-namespaces
```

### Troubleshooting

1. **Container Registry Issues:**
   ```bash
   # Test ACR login
   az acr login --name risinglionacr
   
   # Check images
   az acr repository list --name risinglionacr
   ```

2. **Deployment Issues:**
   ```bash
   # Check pod logs
   kubectl logs -n {namespace} deployment/{app-name}
   
   # Describe deployment
   kubectl describe deployment {app-name} -n {namespace}
   ```

3. **Ingress Issues:**
   ```bash
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Check ingress events
   kubectl describe ingress {ingress-name} -n {namespace}
   ```

## 🔐 Security Features

- **Multi-tenant isolation:** Each PR gets its own namespace
- **Resource limits:** CPU and memory constraints on all pods
- **Security scanning:** Trivy scans on every build
- **Network policies:** Ingress-only traffic allowed
- **Secret management:** Service principal for Azure access

## 📈 Scaling & Performance

- **Horizontal Pod Autoscaling:** Ready for HPA configuration
- **Resource optimization:** Tuned resource requests/limits
- **CDN-ready:** Static assets cached via nginx
- **Multi-replica:** 2 replicas for high availability

## 🛠️ Customization

### Environment Variables
Modify `k8s/configmap.yaml` to add game-specific configuration:

```yaml
data:
  game.config: |
    {
      "maxPlayers": 100,
      "difficulty": "normal",
      "features": {
        "multiplayer": true,
        "analytics": true
      }
    }
```

### Resource Scaling
Adjust `k8s/deployment.yaml` for resource requirements:

```yaml
resources:
  requests:
    memory: "128Mi"
    cpu: "100m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Custom Domains
Update `k8s/ingress.yaml` for your domain configuration:

```yaml
spec:
  rules:
  - host: your-custom-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${APP_NAME}-service
            port:
              number: 80
```

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Verify Azure resources in portal
3. Use kubectl commands for Kubernetes debugging
4. Check ingress controller status

---

**🎮 Ready to deploy your game to the cloud!**