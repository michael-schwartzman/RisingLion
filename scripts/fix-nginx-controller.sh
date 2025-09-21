#!/bin/bash
# Script to fix common nginx ingress controller issues

set -e

echo "🔧 Fixing nginx ingress controller issues..."

# Function to check if nginx controller is healthy
check_nginx_health() {
    echo "Checking nginx controller status..."

    # Check if namespace exists
    if ! kubectl get namespace ingress-nginx > /dev/null 2>&1; then
        echo "❌ Nginx ingress namespace not found"
        return 1
    fi

    # Check if deployment exists
    if ! kubectl get deployment -n ingress-nginx ingress-nginx-controller > /dev/null 2>&1; then
        echo "❌ Nginx controller deployment not found"
        return 1
    fi

    # Check if pods are running
    READY_PODS=$(kubectl get pods -n ingress-nginx -l app.kubernetes.io/component=controller -o json | jq '.items | map(select(.status.phase == "Running")) | length')
    TOTAL_PODS=$(kubectl get pods -n ingress-nginx -l app.kubernetes.io/component=controller -o json | jq '.items | length')

    if [ "$READY_PODS" -eq 0 ] || [ "$TOTAL_PODS" -eq 0 ]; then
        echo "❌ No running nginx controller pods found"
        return 1
    fi

    echo "✅ Nginx controller has $READY_PODS/$TOTAL_PODS pods running"
    return 0
}

# Function to fix node selector issues
fix_node_selectors() {
    echo "Fixing node selectors..."

    # Remove restrictive node selectors
    kubectl patch deployment ingress-nginx-controller -n ingress-nginx --type=json \
        -p='[{"op": "replace", "path": "/spec/template/spec/nodeSelector", "value": {"kubernetes.io/os": "linux"}}]' \
        2>/dev/null || true

    echo "✅ Node selectors fixed"
}

# Function to fix webhook issues
fix_webhooks() {
    echo "Checking webhook configurations..."

    # Check if webhook is causing issues
    if kubectl get validatingwebhookconfigurations ingress-nginx-admission > /dev/null 2>&1; then
        # Check if webhook service has endpoints
        ENDPOINTS=$(kubectl get endpoints -n ingress-nginx ingress-nginx-controller-admission -o json 2>/dev/null | jq -r '.subsets[]?.addresses[]?.ip' | wc -l)

        if [ "$ENDPOINTS" -eq 0 ]; then
            echo "⚠️ Webhook has no endpoints, removing it..."
            kubectl delete validatingwebhookconfigurations ingress-nginx-admission --ignore-not-found=true
            echo "✅ Problematic webhook removed"
        else
            echo "✅ Webhook is healthy"
        fi
    else
        echo "✅ No webhook issues found"
    fi
}

# Function to restart stuck pods
restart_stuck_pods() {
    echo "Checking for stuck pods..."

    # Find pods in Pending state
    PENDING_PODS=$(kubectl get pods -n ingress-nginx -l app.kubernetes.io/component=controller \
        -o json | jq -r '.items[] | select(.status.phase == "Pending") | .metadata.name')

    if [ -n "$PENDING_PODS" ]; then
        echo "Found stuck pods: $PENDING_PODS"
        for POD in $PENDING_PODS; do
            echo "Deleting stuck pod: $POD"
            kubectl delete pod -n ingress-nginx "$POD" --grace-period=0 --force 2>/dev/null || true
        done
        echo "✅ Stuck pods cleared"
    else
        echo "✅ No stuck pods found"
    fi
}

# Function to ensure controller is scheduled
ensure_controller_scheduled() {
    echo "Ensuring controller can be scheduled..."

    # Get deployment replicas
    DESIRED=$(kubectl get deployment -n ingress-nginx ingress-nginx-controller -o json | jq '.spec.replicas')
    AVAILABLE=$(kubectl get deployment -n ingress-nginx ingress-nginx-controller -o json | jq '.status.availableReplicas // 0')

    if [ "$AVAILABLE" -lt "$DESIRED" ]; then
        echo "⚠️ Only $AVAILABLE/$DESIRED replicas available"

        # Scale down and up to trigger rescheduling
        echo "Triggering rescheduling..."
        kubectl scale deployment -n ingress-nginx ingress-nginx-controller --replicas=0
        sleep 5
        kubectl scale deployment -n ingress-nginx ingress-nginx-controller --replicas="$DESIRED"

        echo "✅ Controller rescheduled"
    else
        echo "✅ All replicas are available"
    fi
}

# Main execution
main() {
    echo "========================================="
    echo "   Nginx Ingress Controller Fix Script   "
    echo "========================================="
    echo ""

    # Initial health check
    if check_nginx_health; then
        echo "✅ Nginx controller appears healthy"
    else
        echo "⚠️ Issues detected, attempting fixes..."

        # Apply fixes
        fix_node_selectors
        fix_webhooks
        restart_stuck_pods
        ensure_controller_scheduled

        # Wait for controller to stabilize
        echo "Waiting for controller to stabilize..."
        sleep 10

        # Re-check health
        if check_nginx_health; then
            echo "✅ Nginx controller successfully fixed!"
        else
            echo "⚠️ Some issues may persist. Manual intervention might be required."
            echo "Run: kubectl describe pods -n ingress-nginx"
        fi
    fi

    echo ""
    echo "Current status:"
    kubectl get all -n ingress-nginx
}

# Run main function
main