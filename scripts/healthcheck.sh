#!/bin/bash
# Health check script for Rising Lion deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "================================================"
echo "   Rising Lion Deployment Health Check"
echo "================================================"
echo ""

# Check deployment health
check_deployment() {
    echo "📦 Checking deployment..."

    # Check default namespace deployment
    if kubectl get deployment -n default rising-lion-game > /dev/null 2>&1; then
        READY=$(kubectl get deployment -n default rising-lion-game -o json | jq -r '.status.conditions[] | select(.type=="Available") | .status')
        if [ "$READY" = "True" ]; then
            echo -e "${GREEN}✅ Deployment is healthy in default namespace${NC}"
        else
            echo -e "${RED}❌ Deployment is not ready in default namespace${NC}"
            kubectl describe deployment -n default rising-lion-game | tail -10
        fi
    else
        echo -e "${RED}❌ Deployment not found in default namespace${NC}"
    fi
}

# Check service health
check_service() {
    echo ""
    echo "🔌 Checking services..."

    # Check service in default namespace
    if kubectl get service -n default rising-lion-game-service > /dev/null 2>&1; then
        ENDPOINTS=$(kubectl get endpoints -n default rising-lion-game-service -o json | jq -r '.subsets[]?.addresses[]?.ip' | wc -l | tr -d ' ')
        if [ "$ENDPOINTS" -gt 0 ]; then
            echo -e "${GREEN}✅ Service has $ENDPOINTS endpoint(s) in default namespace${NC}"
        else
            echo -e "${RED}❌ Service has no endpoints in default namespace${NC}"
        fi
    else
        echo -e "${RED}❌ Service not found in default namespace${NC}"
    fi

    # Check ExternalName service in risinglion namespace
    if kubectl get service -n risinglion rising-lion-game-service > /dev/null 2>&1; then
        TYPE=$(kubectl get service -n risinglion rising-lion-game-service -o json | jq -r '.spec.type')
        if [ "$TYPE" = "ExternalName" ]; then
            EXTERNAL=$(kubectl get service -n risinglion rising-lion-game-service -o json | jq -r '.spec.externalName')
            echo -e "${GREEN}✅ ExternalName service points to: $EXTERNAL${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️ ExternalName service not found in risinglion namespace${NC}"
    fi
}

# Check ingress health
check_ingress() {
    echo ""
    echo "🌐 Checking ingress..."

    # Check production ingress
    if kubectl get ingress -n risinglion rising-lion-game-domain-ingress > /dev/null 2>&1; then
        IP=$(kubectl get ingress -n risinglion rising-lion-game-domain-ingress -o json | jq -r '.status.loadBalancer.ingress[]?.ip' | head -1)
        if [ -n "$IP" ]; then
            echo -e "${GREEN}✅ Production ingress has IP: $IP${NC}"
        else
            echo -e "${YELLOW}⚠️ Production ingress has no IP assigned yet${NC}"
        fi
    else
        echo -e "${RED}❌ Production ingress not found${NC}"
    fi
}

# Check nginx controller health
check_nginx() {
    echo ""
    echo "🎮 Checking nginx controller..."

    if kubectl get deployment -n ingress-nginx ingress-nginx-controller > /dev/null 2>&1; then
        READY=$(kubectl get deployment -n ingress-nginx ingress-nginx-controller -o json | jq -r '.status.readyReplicas // 0')
        DESIRED=$(kubectl get deployment -n ingress-nginx ingress-nginx-controller -o json | jq -r '.spec.replicas')

        if [ "$READY" -eq "$DESIRED" ] && [ "$READY" -gt 0 ]; then
            echo -e "${GREEN}✅ Nginx controller is healthy ($READY/$DESIRED pods)${NC}"
        else
            echo -e "${RED}❌ Nginx controller unhealthy ($READY/$DESIRED pods)${NC}"

            # Check for pending pods
            PENDING=$(kubectl get pods -n ingress-nginx -l app.kubernetes.io/component=controller -o json | jq -r '.items[] | select(.status.phase == "Pending") | .metadata.name')
            if [ -n "$PENDING" ]; then
                echo -e "${YELLOW}⚠️ Pending pods: $PENDING${NC}"
                echo "Run: ./scripts/fix-nginx-controller.sh to fix"
            fi
        fi
    else
        echo -e "${RED}❌ Nginx controller not found${NC}"
    fi
}

# Check website accessibility
check_website() {
    echo ""
    echo "🌍 Checking website accessibility..."

    URL="https://risinglion.schwartzman.org"

    # Use curl to check HTTP status
    HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}" -I "$URL" --max-time 10 2>/dev/null || echo "000")

    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
        echo -e "${GREEN}✅ Website is accessible (HTTP $HTTP_STATUS)${NC}"
        echo "   URL: $URL"
    elif [ "$HTTP_STATUS" = "000" ]; then
        echo -e "${RED}❌ Website is not accessible (timeout or connection error)${NC}"
    else
        echo -e "${YELLOW}⚠️ Website returned HTTP $HTTP_STATUS${NC}"
    fi
}

# Summary
print_summary() {
    echo ""
    echo "================================================"
    echo "                 SUMMARY"
    echo "================================================"

    # Quick status of all components
    echo ""
    kubectl get deployment -n default rising-lion-game --no-headers 2>/dev/null || echo "Deployment: Not found"
    kubectl get ingress -n risinglion rising-lion-game-domain-ingress --no-headers 2>/dev/null || echo "Ingress: Not found"

    echo ""
    echo "For detailed information, run:"
    echo "  kubectl describe deployment -n default rising-lion-game"
    echo "  kubectl describe ingress -n risinglion rising-lion-game-domain-ingress"
    echo "  kubectl logs -n default -l app=rising-lion-game --tail=50"
}

# Main execution
main() {
    check_deployment
    check_service
    check_ingress
    check_nginx
    check_website
    print_summary
}

# Run main function
main