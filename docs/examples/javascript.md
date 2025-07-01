# JavaScript Examples

## Node.js (Server-side)

### Basic Screenshot
```javascript
const axios = require('axios');

async function takeScreenshot(url) {
  try {
    const response = await axios.post('http://localhost:3000/screenshot', {
      url: url,
      quality: 'standard'
    });
    
    console.log('Screenshot generated!');
    console.log('File size:', response.data.fileSize, 'bytes');
    console.log('Processing time:', response.data.processingTimeMs, 'ms');
    
    // Save the base64 image
    const fs = require('fs');
    const base64Data = response.data.image.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync('screenshot.png', base64Data, 'base64');
    
    return response.data;
  } catch (error) {
    console.error('Screenshot failed:', error.response?.data || error.message);
  }
}

// Usage
takeScreenshot('https://github.com');
```

### With API Key Authentication
```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'X-API-Key': 'your-secret-api-key',
    'Content-Type': 'application/json'
  }
});

async function takeAuthenticatedScreenshot(url, options = {}) {
  try {
    const response = await client.post('/screenshot', {
      url,
      quality: options.quality || 'standard',
      wait: options.wait || 2000,
      fullPage: options.fullPage || false,
      removeAds: options.removeAds !== false // Default true
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
}

// Usage
takeAuthenticatedScreenshot('https://stripe.com', {
  quality: 'high',
  wait: 3000
});
```

### Multiple Screenshots
```javascript
const axios = require('axios');

async function takeMultipleScreenshots(urls) {
  const results = [];
  
  for (const url of urls) {
    try {
      const response = await axios.post('http://localhost:3000/screenshot', {
        url,
        quality: 'standard',
        removeAds: true
      });
      
      results.push({
        url,
        success: true,
        data: response.data
      });
      
      console.log(`✅ ${url} - ${response.data.processingTimeMs}ms`);
    } catch (error) {
      results.push({
        url,
        success: false,
        error: error.response?.data?.error || error.message
      });
      
      console.log(`❌ ${url} - ${error.message}`);
    }
    
    // Rate limiting - wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return results;
}

// Usage
const urls = [
  'https://github.com',
  'https://stripe.com',
  'https://figma.com'
];

takeMultipleScreenshots(urls).then(results => {
  console.log('All screenshots completed:', results);
});
```

## Browser (Client-side)

### Basic Fetch Example
```javascript
async function takeScreenshot(url) {
  try {
    const response = await fetch('http://localhost:3000/screenshot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        quality: 'standard'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Display the image
      const img = document.createElement('img');
      img.src = data.image;
      document.body.appendChild(img);
      
      console.log('Screenshot generated in', data.processingTimeMs, 'ms');
    } else {
      console.error('Screenshot failed:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Usage
takeScreenshot('https://example.com');
```

### React Component
```jsx
import React, { useState } from 'react';

function ScreenshotGenerator() {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const takeScreenshot = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          quality: 'standard',
          removeAds: true
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScreenshot(data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Request failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to screenshot"
      />
      <button onClick={takeScreenshot} disabled={loading}>
        {loading ? 'Generating...' : 'Take Screenshot'}
      </button>
      
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      
      {screenshot && (
        <div>
          <p>
            Screenshot of {screenshot.url} 
            ({screenshot.width}×{screenshot.height}, 
            {Math.round(screenshot.fileSize / 1024)}KB, 
            {screenshot.processingTimeMs}ms)
          </p>
          <img src={screenshot.image} alt="Screenshot" style={{maxWidth: '100%'}} />
        </div>
      )}
    </div>
  );
}

export default ScreenshotGenerator;
```

### Advanced Browser Example with Quality Selection
```javascript
class URLPixelClient {
  constructor(baseUrl, apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  
  async screenshot(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    
    const response = await fetch(`${this.baseUrl}/screenshot`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url,
        quality: options.quality || 'standard',
        wait: options.wait || 2000,
        fullPage: options.fullPage || false,
        removeAds: options.removeAds !== false
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data;
  }
  
  async health() {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Usage
const client = new URLPixelClient('http://localhost:3000');

// Take screenshot with different quality levels
async function demonstrateQualities() {
  const url = 'https://github.com';
  const qualities = ['standard', 'high', 'retina', 'mobile'];
  
  for (const quality of qualities) {
    try {
      const result = await client.screenshot(url, { quality });
      console.log(`${quality}: ${result.width}×${result.height}, ${Math.round(result.fileSize/1024)}KB`);
      
      // Display image
      const img = document.createElement('img');
      img.src = result.image;
      img.style.maxWidth = '300px';
      img.title = `${quality} quality`;
      document.body.appendChild(img);
      
    } catch (error) {
      console.error(`Failed to take ${quality} screenshot:`, error.message);
    }
  }
}

demonstrateQualities();
```

## Package Installation

For Node.js projects, install the HTTP client:

```bash
npm install axios
# or
npm install node-fetch
```

## Error Handling Best Practices

```javascript
async function robustScreenshot(url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post('http://localhost:3000/screenshot', {
        url,
        quality: 'standard',
        removeAds: true
      });
      
      return response.data;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.response?.data?.error || error.message);
      
      if (attempt === retries) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// Usage with error handling
robustScreenshot('https://example.com')
  .then(result => {
    console.log('Screenshot successful!', result);
  })
  .catch(error => {
    console.error('All attempts failed:', error.message);
  });
```
