# URLPixel Open Source - Self-Hosted Screenshot API

> Deploy your own screenshot API in 2 minutes

**Perfect for**: Learning, privacy, small projects, and experimentation  
**Need more?**: Check out [URLPixel.com](https://urlpixel.com) for production features

---

## 🚀 **Quick Deploy**

### **Railway (Recommended - 2 minutes)**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/urlpixel-open)

1. Click deploy button
2. Wait for build to complete  
3. Use your Railway URL for screenshots

### **Docker (5 minutes)**
```bash
# Using Docker Compose
git clone https://github.com/karinadalca/url-pixel-open.git
cd url-pixel-open
docker-compose up -d

# Or direct Docker run
docker run -p 3000:3000 urlpixel/open
```

### **Manual Installation (10 minutes)**
```bash
# Requirements: Node.js 18+
git clone https://github.com/karinadalca/url-pixel-open.git
cd url-pixel-open
npm install
npm start

# API available at http://localhost:3000
```

**Need help?** Check our **[Complete Deployment Guide →](https://urlpixel.com/open-source/getting-started)**

---

## 📸 **Usage Examples**

### **Basic Screenshot**
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### **High Quality Screenshot**
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "quality": "high",
    "wait": 2000,
    "fullPage": true,
    "removeAds": true
  }'
```

### **With API Key (Optional)**
```bash
# Set API_KEY environment variable, then:
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"url": "https://stripe.com"}'
```

**More examples?** See our **[Complete API Reference →](https://urlpixel.com/open-source/api-reference)**

---

## ✨ **What You Get**

### **Quality Profiles**
- **Standard**: 1280x720 (perfect for previews)
- **High**: 1920x1080 (full HD quality)  
- **Retina**: 2560x1440 (high DPI displays)
- **Mobile**: 375x667 (mobile viewport)

### **Smart Features**
- ⚡ **Optimized wait times** for popular sites (GitHub, Stripe, Figma)
- 🚫 **Ad removal** (cookie banners, popups, advertisements)
- 📱 **Mobile simulation** with proper device scaling
- 🖼️ **Full page screenshots** for complete page capture
- 🔒 **Optional authentication** with API key protection

### **Developer Friendly**
- 📡 **Simple REST API** with JSON responses
- 🔍 **Health monitoring** endpoint for service status
- 📖 **Built-in documentation** at API root endpoint
- 🐳 **Docker ready** with multi-platform support

**Technical details?** Read our **[Architecture Deep Dive →](https://urlpixel.com/open-source/architecture)**

---

## 🎯 **Perfect For**

✅ **Learning**: Understand how screenshot APIs work  
✅ **Privacy**: Keep screenshots on your own infrastructure  
✅ **Small Projects**: Personal tools and experiments  
✅ **Development**: Testing and prototyping  
✅ **Self-Hosting**: Complete control over your service  

---

## 🚀 **Need Production Features?**

For real applications, consider [URLPixel.com](https://urlpixel.com):

| Feature | Open Source | URLPixel.com |
|---------|-------------|--------------|
| Screenshot API | ✅ Basic | ✅ Advanced |
| Performance | 🐌 Single browser | ⚡ 10x faster (pooling) |
| Storage | 📱 Base64 only | ☁️ Global CDN |
| Organization | ❌ | ✅ Site management |
| Dashboard | ❌ | ✅ Full web interface |
| Authentication | 🔑 API key only | 🔐 OAuth + Enterprise |
| Analytics | ❌ | 📊 Usage insights |
| Webhooks | ❌ | 🔗 Real-time notifications |
| Bulk Processing | ❌ | 📦 Parallel generation |
| Support | 🤝 Community | 💼 Professional SLA |

**Pricing**: URLPixel.com is **50-70% cheaper** than competitors while offering more features!

**Detailed comparison?** See our **[Open Source vs Managed Comparison →](https://urlpixel.com/open-source/comparison)**

---

## 📚 **Complete Documentation**

### **Quick Links**
- **[📖 Getting Started Guide](https://urlpixel.com/open-source/getting-started)** - Step-by-step deployment for Railway, Docker, and manual
- **[📡 API Reference](https://urlpixel.com/open-source/api-reference)** - Complete endpoint documentation with examples
- **[⚙️ Production Deployment](https://urlpixel.com/open-source/deployment)** - Advanced setup, scaling, and security
- **[🏗️ Architecture Guide](https://urlpixel.com/open-source/architecture)** - Technical deep dive and implementation details
- **[🔄 Feature Comparison](https://urlpixel.com/open-source/comparison)** - When to self-host vs upgrade to URLPixel.com

### **Local Documentation**
- **[API Reference](docs/api.md)** - Basic endpoint documentation
- **[Deployment Guide](docs/deployment.md)** - Simple setup instructions
- **[Code Examples](docs/examples/)** - Language-specific examples

> 💡 **Pro tip**: The [URLPixel.com documentation](https://urlpixel.com/open-source) is more comprehensive and always up-to-date!

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
# Optional API key for authentication
API_KEY=your-secret-key

# Server port (Railway sets this automatically)
PORT=3000

# Node environment
NODE_ENV=production
```

### **Docker Environment**
```yaml
# docker-compose.yml
services:
  urlpixel:
    image: urlpixel/open
    ports:
      - "3000:3000"
    environment:
      - API_KEY=your-optional-key
```

**Advanced configuration?** Check our **[Production Deployment Guide →](https://urlpixel.com/open-source/deployment)**

---

## 🤝 **Community & Support**

### **Get Help Fast**
1. **[📖 URLPixel.com Documentation](https://urlpixel.com/open-source)** - Comprehensive guides and tutorials
2. **[🔍 GitHub Issues](https://github.com/karinadalca/url-pixel-open/issues)** - Search existing solutions
3. **[💬 GitHub Discussions](https://github.com/karinadalca/url-pixel-open/discussions)** - Ask questions and share ideas
4. **[🎮 Discord Community](https://discord.gg/urlpixel)** - Join the URLPixel community

### **Quick Troubleshooting**
- **Deployment issues?** → [Getting Started Guide](https://urlpixel.com/open-source/getting-started)
- **API not working?** → [API Reference](https://urlpixel.com/open-source/api-reference)  
- **Performance problems?** → [Production Deployment](https://urlpixel.com/open-source/deployment)
- **Need more features?** → [Feature Comparison](https://urlpixel.com/open-source/comparison)

### **Contributing**
- **[Contributing Guidelines](CONTRIBUTING.md)** - Help improve the project
- **[Changelog](CHANGELOG.md)** - See what's new
- **[License](LICENSE)** - MIT License

---

## 🏗️ **How It Works**

This service uses [Puppeteer](https://pptr.dev/) to launch a headless Chrome browser, navigate to your URL, and capture a screenshot. The image is returned as a base64-encoded PNG in the JSON response.

### **Architecture**
```
HTTP Request → Express.js → Puppeteer → Chrome → Screenshot → Base64 → JSON Response
```

### **No Persistent Storage**
- Screenshots are not saved to disk
- No database required
- Completely stateless service
- Perfect for self-hosting

**Want technical details?** Read our **[Architecture Deep Dive →](https://urlpixel.com/open-source/architecture)**

---

## 🌟 **Why Open Source?**

URLPixel believes in:
- **🎓 Education**: Learn how screenshot APIs work
- **🔓 Transparency**: See exactly what the code does  
- **🏠 Privacy**: Keep your data on your infrastructure
- **🤝 Community**: Build better tools together

For production workloads, the managed [URLPixel.com](https://urlpixel.com) service provides enterprise features, global performance, and professional support.

**Compare options?** See our **[Open Source vs Managed Guide →](https://urlpixel.com/open-source/comparison)**

---

## 📄 **License & Credits**

- **License**: MIT - Use freely for any purpose
- **Technology**: Built with Express.js and Puppeteer
- **Powered by**: URLPixel screenshot technology
- **Managed Service**: [URLPixel.com](https://urlpixel.com) for production use

---

**Ready to deploy?** Click the Railway button above or run `docker-compose up` to get started! 🚀

**Need help?** Check our **[Complete Documentation →](https://urlpixel.com/open-source)** or join our **[Discord Community →](https://discord.gg/urlpixel)**

---

**🔗 Quick Links:**
- **[URLPixel.com](https://urlpixel.com)** - Managed screenshot API service
- **[Complete Documentation](https://urlpixel.com/open-source)** - Comprehensive guides and tutorials  
- **[GitHub Repository](https://github.com/karinadalca/url-pixel-open)** - Source code and issues
- **[Discord Community](https://discord.gg/urlpixel)** - Get help and share ideas