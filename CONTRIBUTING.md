# Contributing to URLPixel Open Source

Thank you for your interest in contributing to URLPixel Open Source! This project aims to provide a simple, self-hostable screenshot API that showcases URLPixel's technology.

## 🎯 Project Goals

URLPixel Open Source is designed as:
- **Educational tool** - Help developers understand how screenshot APIs work
- **Privacy solution** - Self-host for complete data control  
- **Developer onboarding** - Introduce developers to URLPixel's technology
- **Open source showcase** - Demonstrate technical capabilities

**Not intended as**: A replacement for the managed [URLPixel.com](https://urlpixel.com) service.

## 🚀 Quick Start for Contributors

### Development Setup
```bash
# Fork and clone your fork
git clone https://github.com/YOUR_USERNAME/url-pixel-open.git
cd url-pixel-open

# Install dependencies
npm install

# Start development server
npm run dev

# Test your changes
curl http://localhost:3000/health
```

### Testing Changes
```bash
# Basic functionality test
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Run the test script
chmod +x test.sh
./test.sh
```

## 🛠️ Types of Contributions

### ✅ Welcome Contributions
- **Bug fixes** - Fix issues with screenshot generation
- **Documentation improvements** - Better examples, clearer instructions
- **Performance optimizations** - Faster screenshot generation
- **Quality improvements** - Better error handling, logging
- **Platform support** - Better Docker, Railway, or cloud deployment
- **Developer experience** - Easier setup, better debugging

### ⚠️ Limited Scope Contributions
- **Major feature additions** - Keep it simple (redirect to URLPixel.com for advanced features)
- **UI/Dashboard** - This is an API-only service
- **Authentication systems** - Only simple API key auth
- **Database integration** - Stateless design is intentional

### ❌ Out of Scope
- **User management systems** - Use URLPixel.com for this
- **Advanced analytics** - Use URLPixel.com for this
- **Complex configuration** - Keep it simple for self-hosting
- **Breaking changes** - Maintain deployment simplicity

## 📝 Contribution Process

### 1. Before You Start
- Check existing [issues](https://github.com/karinadalca/url-pixel-open/issues)
- For major changes, open an issue first to discuss
- Make sure your change aligns with project goals

### 2. Making Changes
```bash
# Create a feature branch
git checkout -b feature/your-improvement

# Make your changes
# Test thoroughly

# Commit with clear message
git commit -m "Fix: Improve screenshot quality for mobile sites"

# Push and create PR
git push origin feature/your-improvement
```

### 3. Pull Request Guidelines
- **Clear title** - Describe what the PR does
- **Detailed description** - Explain the problem and solution
- **Test instructions** - How to verify the changes work
- **Breaking changes** - Clearly mark any breaking changes

### Example PR Description
```markdown
## Problem
Screenshot generation fails for sites with complex CSS animations.

## Solution
Added wait time adjustment based on detected animations.

## Testing
- Test with https://stripe.com (complex animations)
- Verify other sites still work normally
- Run ./test.sh to ensure no regressions

## Changes
- Modified wait time calculation in generateScreenshot()
- Added animation detection logic
- Updated documentation with new behavior
```

## 🧪 Testing Guidelines

### Required Tests
- Health check endpoint returns 200
- Screenshot generation works for basic sites
- Error handling for invalid URLs
- API key authentication (if enabled)

### Test Sites (Good for Testing)
- `https://example.com` - Simple, fast loading
- `https://github.com` - Complex but reliable
- `https://stripe.com` - Animations and modern design
- `https://httpstat.us/500` - Error testing

### Performance Expectations
- Health check: < 100ms
- Simple screenshots: < 5 seconds
- Complex sites: < 10 seconds
- Error responses: < 1 second

## 📚 Code Guidelines

### Code Style
- Use existing formatting (Prettier config coming)
- Clear variable names (`screenshotBuffer` not `buf`)
- Comprehensive error handling
- Add JSDoc comments for functions

### Example Function
```javascript
/**
 * Generate screenshot with error handling and optimization
 * @param {Object} config - Screenshot configuration
 * @param {string} config.url - URL to screenshot
 * @param {string} config.quality - Quality profile
 * @returns {Promise<Object>} Screenshot result with metadata
 */
async function generateScreenshot(config) {
  // Implementation with proper error handling
}
```

### Dependencies
- Keep dependencies minimal
- Avoid adding new dependencies unless necessary
- Security-focused: keep packages updated

## 🔧 Architecture Understanding

### Core Components
```
server.js
├── Express.js server setup
├── Quality profile definitions
├── Site-specific optimizations  
├── Screenshot generation logic
└── Error handling
```

### Key Principles
- **Stateless** - No database or persistent storage
- **Simple** - Single file, minimal configuration  
- **Reliable** - Proven logic from production URLPixel
- **Fast** - Optimized wait times for popular sites

## 🐛 Bug Reports

### Great Bug Reports Include
- **Environment** - OS, Node version, deployment method
- **Steps to reproduce** - Exact commands/requests
- **Expected behavior** - What should happen
- **Actual behavior** - What actually happens
- **Error messages** - Full error output
- **URL being tested** - Helps with reproduction

### Bug Report Template
```markdown
**Environment:**
- OS: Ubuntu 22.04
- Node.js: v18.17.0
- Deployment: Docker

**Steps to reproduce:**
1. Start service with `docker-compose up`
2. Send request: `curl -X POST ...`
3. See error response

**Expected:** Screenshot generated successfully
**Actual:** 500 error with "Navigation timeout"

**Error logs:**
```
[error log here]
```

**URL tested:** https://example-slow-site.com
```

## 📖 Documentation Contributions

### Areas Needing Help
- More code examples in different languages
- Better deployment guides for specific platforms
- Troubleshooting guides for common issues
- Performance optimization tips

### Documentation Standards
- Clear, actionable instructions
- Working code examples (test them!)
- Explain the "why" not just the "how"
- Include upgrade path to URLPixel.com where relevant

## 🌟 Recognition

Contributors will be:
- Listed in README acknowledgments
- Mentioned in release notes
- Invited to URLPixel Discord community
- Eligible for URLPixel.com credits (for significant contributions)

## ❓ Questions?

- **Technical questions** - [GitHub Issues](https://github.com/karinadalca/url-pixel-open/issues)
- **General discussion** - [GitHub Discussions](https://github.com/karinadalca/url-pixel-open/discussions)
- **Quick help** - [URLPixel Discord](https://discord.gg/urlpixel)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make URLPixel Open Source better!** 🚀

For production applications with advanced features, consider [URLPixel.com](https://urlpixel.com).
