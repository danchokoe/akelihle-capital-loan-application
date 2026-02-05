#!/bin/bash

echo "🚀 Checking AWS Amplify Deployment Status..."
echo "================================================"

# Check if the main site is accessible
echo "📱 Checking main site..."
if curl -s -o /dev/null -w "%{http_code}" https://main.d11901v661d27z.amplifyapp.com/ | grep -q "200"; then
    echo "✅ Main site is accessible"
else
    echo "❌ Main site is not accessible or still building"
fi

# Check if the logo file is accessible
echo "🖼️  Checking logo file..."
if curl -s -o /dev/null -w "%{http_code}" https://main.d11901v661d27z.amplifyapp.com/logo.png | grep -q "200"; then
    echo "✅ Logo file is accessible - deployment successful!"
else
    echo "⏳ Logo file not yet accessible - deployment may still be in progress"
fi

echo ""
echo "🔗 Live Site: https://main.d11901v661d27z.amplifyapp.com/"
echo "📊 GitHub Repo: https://github.com/danchokoe/akelihle-capital-loan-application"
echo ""
echo "💡 AWS Amplify typically takes 2-5 minutes to rebuild after a git push."
echo "   If the logo is not showing yet, please wait a few minutes and check again."