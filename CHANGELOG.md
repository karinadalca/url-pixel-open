# Changelog

All notable changes to URLPixel Open Source will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-01

### Added
- **Core screenshot API** with POST /screenshot endpoint
- **Multiple quality profiles**: standard (1280×720), high (1920×1080), retina (2560×1440), mobile (375×667)
- **Smart wait times** for 20+ popular sites (GitHub, Stripe, Figma, etc.)
- **Ad removal system** - automatically removes cookie banners, popups, chat widgets
- **Optional API key authentication** via X-API-Key header or Bearer token
- **Health monitoring** endpoint at GET /health with service status and metrics
- **Railway one-click deployment** with railway.toml configuration
- **Docker support** with Dockerfile and docker-compose.yml
- **Comprehensive documentation** including API reference and deployment guide
- **Code examples** for JavaScript/Node.js, Python, cURL, and more
- **Error handling** with proper HTTP status codes and descriptive messages
- **Full page screenshots** option for capturing entire page content
- **Base64 image responses** - no file storage required, completely stateless

### Technical Features
- **Puppeteer integration** with optimized Chrome launch arguments
- **Memory-efficient** browser management with proper cleanup
- **Request logging** with processing time metrics
- **Input validation** for URLs and parameters
- **CORS support** for cross-origin requests
- **Graceful shutdown** handling for production deployments
- **Environment variable configuration** for flexible deployment
- **Health checks** with uptime and memory usage reporting

### Documentation
- **Complete API reference** with request/response examples
- **Deployment guides** for Railway, Docker, and manual installation  
- **Code examples** in multiple programming languages
- **Architecture documentation** explaining the single-service design
- **Contributing guidelines** for open source development
- **MIT License** for maximum compatibility

### Deployment Support
- **Railway** - One-click deployment with automatic scaling
- **Docker** - Multi-platform container support with health checks
- **Manual** - Simple npm install and start process
- **Cloud platforms** - Compatible with Heroku, Vercel, DigitalOcean, AWS

### Performance Optimizations
- **Site-specific wait times** - Optimized loading for popular developer sites
- **Efficient ad removal** - Fast DOM cleanup without breaking layouts
- **Resource limits** - Configured for optimal memory usage
- **Browser args** - Production-tuned Puppeteer configuration
- **Error boundaries** - Robust error handling prevents service crashes

---

## Planned Releases

### [1.1.0] - Planned
- **Rate limiting** - Basic request rate limiting for self-hosted instances
- **Batch processing** - Support for multiple URLs in single request
- **Image optimization** - Configurable compression levels
- **Webhook support** - Optional webhook notifications for screenshot completion
- **Better error messages** - More descriptive error responses with suggestions

### [1.2.0] - Planned  
- **Custom headers** - Support for authentication headers and custom user agents
- **PDF generation** - Optional PDF output alongside PNG screenshots
- **Element selection** - Screenshot specific page elements by CSS selector
- **Mobile device simulation** - Additional mobile device presets
- **Performance metrics** - Extended metrics and monitoring capabilities

---

## Upgrade Path

For production applications requiring advanced features:

### URLPixel.com Exclusive Features
- 🏗️ **Site Organization** - Manage screenshots by project with folders and tags
- ⚡ **10x Performance** - Browser pooling and global edge deployment
- 📊 **Analytics Dashboard** - Usage insights, performance metrics, and monitoring
- 🔗 **Advanced Integrations** - Webhooks, bulk processing APIs, and automation
- 💼 **Professional Support** - SLA guarantees and dedicated technical assistance
- 🌍 **Global CDN** - Worldwide deployment for minimal latency
- 🔐 **Enterprise Authentication** - OAuth, SSO, team management, and access controls
- 📦 **Bulk Processing** - Process hundreds of screenshots in parallel
- 🎯 **Smart Optimization** - AI-powered wait times and quality optimization

**Pricing**: URLPixel.com is 50-70% cheaper than competitors while offering significantly more features.

**Migration**: URLPixel Open Source users get priority access to URLPixel.com beta features and migration assistance.

---

## Support

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and community help  
- **Discord Community** - Real-time chat and support
- **Documentation** - Comprehensive guides and examples

## Acknowledgments

URLPixel Open Source is based on production technology from [URLPixel.com](https://urlpixel.com), battle-tested with millions of screenshots generated.

**Contributors:**
- Karina Dalca ([@karinadalca](https://github.com/karinadalca)) - Original author and maintainer

---

For the latest updates and announcements, follow [@URLPixel](https://twitter.com/urlpixel) on Twitter or join our [Discord community](https://discord.gg/urlpixel).
