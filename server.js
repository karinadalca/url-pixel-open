// URLPixel Open Source - Self-Hosted Screenshot API
// Based on production URLPixel technology
// Repository: https://github.com/karinadalca/url-pixel-open
// Managed Service: https://urlpixel.com

const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // Optional authentication

// Configuration
const DEFAULT_WAIT_TIME = 1500;
const MAX_WAIT_TIME = 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging (simplified)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.path}`);
  next();
});

// Quality profiles (from URLPixel production service)
const qualityProfiles = {
  standard: { width: 1280, height: 720, deviceScaleFactor: 1 },
  high: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  retina: { width: 2560, height: 1440, deviceScaleFactor: 2 },
  mobile: { width: 375, height: 667, deviceScaleFactor: 2 }
};

// Smart wait times for optimized sites (URLPixel's proven optimizations)
const siteOptimizedWaitTimes = {
  'github.com': 2000,
  'gitlab.com': 2000,
  'figma.com': 3000,
  'dribbble.com': 1000,
  'behance.net': 2000,
  'stripe.com': 1500,
  'vercel.com': 1000,
  'netlify.com': 1000,
  'heroku.com': 1500,
  'railway.app': 1000,
  'medium.com': 2000,
  'dev.to': 1500,
  'hashnode.com': 1500,
  'substack.com': 2000,
  'notion.so': 3000,
  'airtable.com': 2500,
  'google.com': 500,
  'youtube.com': 2000,
  'twitter.com': 1500,
  'x.com': 1500,
  'linkedin.com': 2000,
  'facebook.com': 2000,
  'instagram.com': 2000,
  'reddit.com': 1500,
  'producthunt.com': 2000
};

// Optional API key authentication
function authenticateApiKey(req, res, next) {
  if (!API_KEY) {
    // No authentication required if no API key is set
    return next();
  }
  
  const providedKey = req.headers['x-api-key'] || 
                     req.headers.authorization?.replace('Bearer ', '');
  
  if (providedKey !== API_KEY) {
    return res.status(401).json({ 
      error: 'Invalid API key',
      message: 'Provide API key in X-API-Key header or Authorization: Bearer token'
    });
  }
  
  next();
}

// Helper functions
function getOptimizedWaitTime(url, userWaitTime) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    const optimizedTime = siteOptimizedWaitTimes[domain];
    return Math.min(optimizedTime || userWaitTime || DEFAULT_WAIT_TIME, MAX_WAIT_TIME);
  } catch (error) {
    return Math.min(userWaitTime || DEFAULT_WAIT_TIME, MAX_WAIT_TIME);
  }
}

async function cleanPage(page) {
  try {
    await page.evaluate(() => {
      const selectorsToRemove = [
        // Cookie banners and GDPR notices
        '[id*="cookie"]', '[class*="cookie"]', '[id*="gdpr"]', '[class*="gdpr"]',
        '[class*="consent"]', '[id*="consent"]',
        
        // Advertisements
        '.ad', '.ads', '[id*="ad-"]', '[class*="advertisement"]',
        '[class*="banner-ad"]', '[id*="banner"]',
        
        // Chat widgets and support
        '[id*="chat"]', '[class*="chat-widget"]', '[class*="intercom"]',
        '[class*="zendesk"]', '[class*="helpdesk"]',
        
        // Popups and modals
        '[class*="newsletter-popup"]', '[class*="email-signup"]',
        '[class*="subscription-modal"]', '[class*="popup"]', '[class*="modal"]',
        
        // Notification bars
        '[class*="notification-bar"]', '[class*="promo-bar"]', '[class*="top-bar"]'
      ];
      
      selectorsToRemove.forEach(selector => {
        try {
          document.querySelectorAll(selector).forEach(el => {
            if (el && el.parentNode) {
              el.parentNode.removeChild(el);
            }
          });
        } catch (e) {
          // Ignore individual selector errors
        }
      });
      
      // Remove elements with certain text content
      const textMatches = ['accept cookies', 'cookie policy', 'privacy policy', 'subscribe now'];
      textMatches.forEach(text => {
        try {
          const xpath = `//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '${text}')]`;
          const result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
          for (let i = 0; i < result.snapshotLength; i++) {
            const el = result.snapshotItem(i);
            if (el && el.parentNode && el.tagName !== 'BODY' && el.tagName !== 'HTML') {
              el.parentNode.removeChild(el);
            }
          }
        } catch (e) {
          // XPath not supported in all browsers
        }
      });
    });
  } catch (error) {
    // Continue without cleaning if there's an error
    console.log('Page cleaning failed, continuing...', error.message);
  }
}

async function generateScreenshot(config) {
  const {
    url,
    quality = 'standard',
    wait,
    fullPage = false,
    removeAds = true
  } = config;

  // Input validation
  if (!url) {
    throw new Error('URL is required');
  }

  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format');
  }

  const optimizedWaitTime = getOptimizedWaitTime(url, wait);
  const profile = qualityProfiles[quality] || qualityProfiles.standard;

  // Launch browser for each request (simplified approach)
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--no-first-run',
      '--disable-features=VizDisplayCompositor',
      '--disable-extensions',
      '--disable-plugins',
      '--memory-pressure-off',
      '--disable-web-security',
      '--disable-features=site-per-process',
      '--disable-hang-monitor',
      '--disable-client-side-phishing-detection',
      '--disable-prompt-on-repost',
      '--max_old_space_size=4096'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    defaultViewport: null,
    timeout: 30000
  });

  const page = await browser.newPage();
  
  try {
    // Set timeouts
    page.setDefaultTimeout(20000);
    page.setDefaultNavigationTimeout(20000);

    // Configure viewport
    await page.setViewport({
      width: profile.width,
      height: profile.height,
      deviceScaleFactor: profile.deviceScaleFactor
    });

    // Set user agent
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 URLPixel-Open/1.0'
    );

    // Navigate to URL
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 20000 
    });

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, optimizedWaitTime));

    // Clean page if requested
    if (removeAds) {
      await cleanPage(page);
    }

    // Generate screenshot
    const screenshotBuffer = await page.screenshot({
      type: 'png',
      fullPage,
      captureBeyondViewport: fullPage
    });

    return {
      imageBuffer: Buffer.from(screenshotBuffer),
      width: profile.width * profile.deviceScaleFactor,
      height: fullPage ? 0 : profile.height * profile.deviceScaleFactor
    };

  } finally {
    await page.close();
    await browser.close();
  }
}

// API Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'URLPixel Open Source',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Root endpoint - API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'URLPixel Open Source',
    description: 'Self-hosted screenshot API',
    version: '1.0.0',
    endpoints: {
      'POST /screenshot': 'Generate screenshot from URL',
      'GET /health': 'Service health check',
      'GET /': 'This API documentation'
    },
    usage: {
      endpoint: 'POST /screenshot',
      body: {
        url: 'https://example.com',
        quality: 'standard|high|retina|mobile',
        wait: 3000,
        fullPage: false,
        removeAds: true
      },
      headers: API_KEY ? {
        'X-API-Key': 'your-api-key',
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      }
    },
    authentication: API_KEY ? 'API key required in X-API-Key header' : 'No authentication required',
    documentation: 'https://github.com/karinadalca/url-pixel-open',
    managedService: {
      url: 'https://urlpixel.com',
      description: 'Production features: site organization, dashboard, analytics, global performance'
    }
  });
});

// Screenshot endpoint
app.post('/screenshot', authenticateApiKey, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const result = await generateScreenshot(req.body);
    const processingTime = Date.now() - startTime;
    const base64Image = result.imageBuffer.toString('base64');
    
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Image}`,
      url: req.body.url,
      quality: req.body.quality || 'standard',
      width: result.width,
      height: result.height,
      fileSize: result.imageBuffer.length,
      processingTimeMs: processingTime
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    let statusCode = 500;
    let errorMessage = error.message;

    if (error.message.includes('timeout')) {
      statusCode = 408;
      errorMessage = 'Navigation timeout - site took too long to load';
    } else if (error.message.includes('Invalid URL')) {
      statusCode = 400;
    } else if (error.message.includes('URL is required')) {
      statusCode = 400;
    }

    console.error('Screenshot error:', error.message);

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      processingTimeMs: processingTime
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 URLPixel Open Source running on port ${PORT}`);
  
  if (API_KEY) {
    console.log('🔒 API key authentication enabled');
  } else {
    console.log('🔓 No authentication required (set API_KEY environment variable to enable)');
  }
  
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
  console.log(`🌟 Managed service: https://urlpixel.com`);
});
