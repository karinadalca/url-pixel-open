---
name: Bug Report
about: Report a bug to help us improve URLPixel Open Source
title: '[BUG] '
labels: bug
assignees: ''

---

## 🐛 Bug Description
A clear and concise description of what the bug is.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Run command '....'
3. Send request '....'
4. See error

## ✅ Expected Behavior
A clear and concise description of what you expected to happen.

## ❌ Actual Behavior
A clear and concise description of what actually happened.

## 🌍 Environment
- **OS**: [e.g. Ubuntu 22.04, macOS 13, Windows 11]
- **Node.js Version**: [e.g. v18.17.0]
- **Deployment Method**: [e.g. Railway, Docker, Manual]
- **URLPixel Version**: [e.g. 1.0.0]

## 📝 Error Logs
```
Paste any error logs here
```

## 🌐 Test URL
- **URL being tested**: [e.g. https://example.com]
- **Quality setting**: [e.g. standard, high, retina, mobile]
- **Additional options**: [e.g. fullPage: true, removeAds: false]

## 📋 Request Details
```bash
# Paste the exact curl command or code you used
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 📊 Response Details
```json
{
  "paste": "actual response here"
}
```

## 🔍 Additional Context
Add any other context about the problem here, including:
- Does this happen with all URLs or specific ones?
- Does this happen consistently or intermittently?
- Any recent changes to your setup?
- Screenshots of the issue (if applicable)

## 🚀 Possible Solution
If you have ideas on how to fix this, please share them here.

---

**Checklist:**
- [ ] I have checked existing issues for duplicates
- [ ] I have tested with the latest version
- [ ] I have included all relevant environment information
- [ ] I have provided clear steps to reproduce
- [ ] I have included error logs (if any)
