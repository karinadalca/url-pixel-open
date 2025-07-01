# Python Examples

## Basic Usage with requests

### Simple Screenshot
```python
import requests
import base64
import json

def take_screenshot(url, api_key=None):
    """Take a screenshot of the given URL"""
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    if api_key:
        headers['X-API-Key'] = api_key
    
    payload = {
        'url': url,
        'quality': 'standard',
        'removeAds': True
    }
    
    try:
        response = requests.post(
            'http://localhost:3000/screenshot',
            headers=headers,
            json=payload,
            timeout=30
        )
        
        response.raise_for_status()
        data = response.json()
        
        if data['success']:
            print(f"Screenshot generated in {data['processingTimeMs']}ms")
            print(f"Image size: {data['fileSize']} bytes")
            print(f"Dimensions: {data['width']}x{data['height']}")
            
            # Save the image
            image_data = data['image'].split(',')[1]  # Remove data:image/png;base64,
            with open('screenshot.png', 'wb') as f:
                f.write(base64.b64decode(image_data))
            
            return data
        else:
            print(f"Screenshot failed: {data['error']}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# Usage
result = take_screenshot('https://github.com')
```

### Advanced Screenshot with Options
```python
import requests
import base64
from typing import Optional, Dict, Any

class URLPixelClient:
    def __init__(self, base_url: str = 'http://localhost:3000', api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()
        
        if api_key:
            self.session.headers.update({'X-API-Key': api_key})
    
    def screenshot(self, url: str, quality: str = 'standard', 
                   wait: int = 2000, full_page: bool = False, 
                   remove_ads: bool = True) -> Optional[Dict[str, Any]]:
        """
        Take a screenshot with specified options
        
        Args:
            url: The URL to screenshot
            quality: Quality profile ('standard', 'high', 'retina', 'mobile')
            wait: Wait time in milliseconds
            full_page: Whether to capture full page
            remove_ads: Whether to remove ads and popups
        
        Returns:
            Screenshot data dictionary or None if failed
        """
        payload = {
            'url': url,
            'quality': quality,
            'wait': wait,
            'fullPage': full_page,
            'removeAds': remove_ads
        }
        
        try:
            response = self.session.post(
                f'{self.base_url}/screenshot',
                json=payload,
                timeout=60
            )
            
            response.raise_for_status()
            data = response.json()
            
            if not data['success']:
                raise Exception(data['error'])
            
            return data
            
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
        except Exception as e:
            print(f"Screenshot failed: {e}")
            return None
    
    def save_screenshot(self, screenshot_data: Dict[str, Any], filename: str = 'screenshot.png'):
        """Save screenshot data to file"""
        if not screenshot_data or 'image' not in screenshot_data:
            raise ValueError("Invalid screenshot data")
        
        # Extract base64 data
        image_data = screenshot_data['image'].split(',')[1]
        
        with open(filename, 'wb') as f:
            f.write(base64.b64decode(image_data))
        
        print(f"Screenshot saved as {filename}")
    
    def health_check(self) -> Optional[Dict[str, Any]]:
        """Check service health"""
        try:
            response = self.session.get(f'{self.base_url}/health')
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Health check failed: {e}")
            return None

# Usage example
client = URLPixelClient()

# Take different quality screenshots
urls = ['https://github.com', 'https://stripe.com']
qualities = ['standard', 'high', 'mobile']

for url in urls:
    for quality in qualities:
        print(f"Taking {quality} screenshot of {url}...")
        
        result = client.screenshot(
            url=url,
            quality=quality,
            wait=3000,
            remove_ads=True
        )
        
        if result:
            filename = f"screenshot_{quality}_{url.split('//')[1].replace('/', '_')}.png"
            client.save_screenshot(result, filename)
        else:
            print(f"Failed to screenshot {url} with {quality} quality")
```

### Batch Processing
```python
import requests
import base64
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any

class BatchScreenshotProcessor:
    def __init__(self, base_url: str = 'http://localhost:3000', api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key
        self.headers = {'Content-Type': 'application/json'}
        
        if api_key:
            self.headers['X-API-Key'] = api_key
    
    def screenshot_single(self, url: str, quality: str = 'standard') -> Dict[str, Any]:
        """Take a single screenshot"""
        payload = {
            'url': url,
            'quality': quality,
            'removeAds': True
        }
        
        try:
            response = requests.post(
                f'{self.base_url}/screenshot',
                headers=self.headers,
                json=payload,
                timeout=60
            )
            
            response.raise_for_status()
            data = response.json()
            
            return {
                'url': url,
                'success': data['success'],
                'data': data if data['success'] else None,
                'error': data.get('error') if not data['success'] else None
            }
            
        except Exception as e:
            return {
                'url': url,
                'success': False,
                'data': None,
                'error': str(e)
            }
    
    def screenshot_batch_sequential(self, urls: List[str], quality: str = 'standard', 
                                   delay: float = 1.0) -> List[Dict[str, Any]]:
        """Process URLs sequentially with delay between requests"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"Processing {i+1}/{len(urls)}: {url}")
            
            result = self.screenshot_single(url, quality)
            results.append(result)
            
            if result['success']:
                print(f"✅ Success - {result['data']['processingTimeMs']}ms")
            else:
                print(f"❌ Failed - {result['error']}")
            
            # Add delay between requests (be nice to the service)
            if i < len(urls) - 1:
                time.sleep(delay)
        
        return results

# Usage example
processor = BatchScreenshotProcessor()

# List of URLs to process
urls = [
    'https://github.com',
    'https://stripe.com',
    'https://figma.com',
    'https://vercel.com',
    'https://railway.app'
]

# Process sequentially (safer for self-hosted)
print("Processing screenshots sequentially...")
results = processor.screenshot_batch_sequential(urls, quality='standard', delay=2.0)

# Print summary
successful = sum(1 for r in results if r['success'])
print(f"\nSummary: {successful}/{len(results)} screenshots successful")
```

### Django Integration
```python
# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import requests
import json

@csrf_exempt
@require_http_methods(["POST"])
def screenshot_api(request):
    """Django view to proxy screenshot requests"""
    
    try:
        data = json.loads(request.body)
        url = data.get('url')
        
        if not url:
            return JsonResponse({'error': 'URL is required'}, status=400)
        
        # Forward to URLPixel Open Source
        response = requests.post(
            'http://localhost:3000/screenshot',
            json={
                'url': url,
                'quality': data.get('quality', 'standard'),
                'wait': data.get('wait', 2000),
                'fullPage': data.get('fullPage', False),
                'removeAds': data.get('removeAds', True)
            },
            timeout=60
        )
        
        response.raise_for_status()
        screenshot_data = response.json()
        
        return JsonResponse(screenshot_data)
        
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': f'Screenshot service error: {str(e)}'}, status=502)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'Internal error: {str(e)}'}, status=500)

# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('api/screenshot/', views.screenshot_api, name='screenshot'),
]
```

### Flask Integration
```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/screenshot', methods=['POST'])
def screenshot():
    """Flask endpoint to take screenshots"""
    
    data = request.get_json()
    
    if not data or 'url' not in data:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        # Forward to URLPixel Open Source
        response = requests.post(
            'http://localhost:3000/screenshot',
            json=data,
            timeout=60
        )
        
        response.raise_for_status()
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Screenshot service error: {str(e)}'}), 502
    except Exception as e:
        return jsonify({'error': f'Internal error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

## Installation

Install the required packages:

```bash
pip install requests
```

For advanced features:
```bash
pip install requests[security] Pillow  # For image processing
```
