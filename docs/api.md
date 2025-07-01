# URLPixel Open Source API Reference

## Base URL
```
http://localhost:3000  # Local development
https://your-railway-app.railway.app  # Railway deployment
```

## Authentication

Authentication is **optional**. If you set the `API_KEY` environment variable, all requests must include the API key.

### With API Key
```bash
# Set environment variable
export API_KEY="your-secret-key"

# Include in requests
curl -H "X-API-Key: your-secret-key" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/screenshot \
     -d '{"url": "https://example.com"}'
```

### Without Authentication
```bash
# No API key needed
curl -H "Content-Type: application/json" \
     -X POST http://localhost:3000/screenshot \
     -d '{"url": "https://example.com"}'
```

## Endpoints

### POST /screenshot

Generate a screenshot of any URL.

#### Request Body
```json
{
  "url": "https://example.com",
  "quality": "standard",
  "wait": 3000,
  "fullPage": false,
  "removeAds": true
}
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `url` | string | **required** | The URL to screenshot |
| `quality` | string | `"standard"` | Quality profile: `standard`, `high`, `retina`, `mobile` |
| `wait` | number | `1500` | Wait time in milliseconds (1000-8000) |
| `fullPage` | boolean | `false` | Capture full page instead of viewport |
| `removeAds` | boolean | `true` | Remove ads, popups, and cookie banners |

#### Quality Profiles

| Profile | Dimensions | Device Scale | Use Case |
|---------|------------|--------------|----------|
| `standard` | 1280×720 | 1x | General previews |
| `high` | 1920×1080 | 1x | HD quality |
| `retina` | 2560×1440 | 2x | High DPI displays |
| `mobile` | 375×667 | 2x | Mobile viewport |

#### Success Response
```json
{
  "success": true,
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "url": "https://example.com",
  "quality": "standard",
  "width": 1280,
  "height": 720,
  "fileSize": 145623,
  "processingTimeMs": 2500
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Navigation timeout - site took too long to load",
  "processingTimeMs": 8000
}
```

### GET /health

Check service health and status.

#### Response
```json
{
  "status": "healthy",
  "service": "URLPixel Open Source",
  "version": "1.0.0",
  "timestamp": "2025-07-01T12:00:00.000Z",
  "uptime": 3600,
  "memory": {
    "rss": 45056000,
    "heapTotal": 20480000,
    "heapUsed": 15360000
  }
}
```

### GET /

Get API documentation and service information.

#### Response
```json
{
  "name": "URLPixel Open Source",
  "description": "Self-hosted screenshot API",
  "version": "1.0.0",
  "endpoints": {
    "POST /screenshot": "Generate screenshot from URL",
    "GET /health": "Service health check",
    "GET /": "This API documentation"
  },
  "usage": {
    "endpoint": "POST /screenshot",
    "body": {
      "url": "https://example.com",
      "quality": "standard|high|retina|mobile",
      "wait": 3000,
      "fullPage": false,
      "removeAds": true
    }
  },
  "authentication": "No authentication required",
  "documentation": "https://github.com/karinadalca/url-pixel-open",
  "managedService": {
    "url": "https://urlpixel.com",
    "description": "Production features: site organization, dashboard, analytics, global performance"
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid URL or parameters |
| 401 | Unauthorized - Invalid API key |
| 408 | Request Timeout - Site took too long to load |
| 500 | Internal Server Error - Service error |

## Rate Limiting

The open source version has no built-in rate limiting. For production use with rate limiting, monitoring, and advanced features, consider [URLPixel.com](https://urlpixel.com).

## Smart Optimizations

URLPixel Open Source includes proven optimizations from the production service:

### Optimized Wait Times
Different sites have optimized wait times for best results:
- GitHub, GitLab: 2000ms
- Figma: 3000ms  
- Stripe: 1500ms
- Google: 500ms
- And many more...

### Ad Removal
Automatically removes common elements:
- Cookie consent banners
- Newsletter popups
- Chat widgets
- Advertisement banners
- Notification bars

## Examples

### Basic Screenshot
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

### High Quality Mobile Screenshot
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://stripe.com", 
    "quality": "mobile",
    "wait": 2000,
    "removeAds": true
  }'
```

### Full Page Screenshot
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "quality": "high", 
    "fullPage": true
  }'
```

## Production Alternative

For production applications, [URLPixel.com](https://urlpixel.com) offers:

- 🏗️ **Site Organization**: Manage screenshots by project
- ⚡ **10x Performance**: Browser pooling & global edge deployment  
- 📊 **Analytics**: Usage insights & monitoring dashboard
- 🔗 **Integrations**: Webhooks & bulk processing APIs
- 💼 **Support**: Professional SLA & dedicated assistance
- 🌍 **Global CDN**: Faster delivery worldwide
- 🔐 **Enterprise Auth**: OAuth, SSO, team management

**Pricing**: 50-70% cheaper than competitors with more features!
