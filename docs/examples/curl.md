# cURL Examples

## Basic Screenshot

### Simple Request
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

### With Quality Setting
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://stripe.com",
    "quality": "high",
    "removeAds": true
  }'
```

## Authentication

### With API Key (if enabled)
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{"url": "https://example.com"}'
```

### Alternative Bearer Token Format
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-api-key" \
  -d '{"url": "https://example.com"}'
```

## Quality Profiles

### Standard Quality (1280×720)
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "quality": "standard"
  }'
```

### High Quality (1920×1080)
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://figma.com",
    "quality": "high",
    "wait": 3000
  }'
```

### Retina Quality (2560×1440, 2x scale)
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://stripe.com",
    "quality": "retina",
    "wait": 2000,
    "removeAds": true
  }'
```

### Mobile Quality (375×667, 2x scale)
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://twitter.com",
    "quality": "mobile",
    "wait": 2000
  }'
```

## Advanced Options

### Full Page Screenshot
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com/microsoft/vscode",
    "quality": "high",
    "fullPage": true,
    "wait": 3000
  }'
```

### Custom Wait Time
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://notion.so",
    "quality": "standard",
    "wait": 5000,
    "removeAds": true
  }'
```

### Disable Ad Removal
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "quality": "standard", 
    "removeAds": false
  }'
```

## Service Health

### Health Check
```bash
curl http://localhost:3000/health
```

### API Documentation
```bash
curl http://localhost:3000/
```

## Output Processing

### Save Response to File
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}' \
  -o screenshot_response.json
```

### Extract Base64 Image with jq
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}' | \
  jq -r '.image' | \
  sed 's/data:image\/png;base64,//' | \
  base64 -d > screenshot.png
```

### Pretty Print JSON Response
```bash
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stripe.com"}' | \
  jq '.'
```

### Extract Specific Fields
```bash
# Get just the processing time and file size
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}' | \
  jq '{processingTimeMs, fileSize, width, height}'
```

## Batch Processing

### Multiple URLs with Bash Loop
```bash
#!/bin/bash

urls=(
  "https://github.com"
  "https://stripe.com" 
  "https://figma.com"
  "https://vercel.com"
)

for url in "${urls[@]}"; do
  echo "Taking screenshot of $url..."
  
  response=$(curl -s -X POST http://localhost:3000/screenshot \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$url\", \"quality\": \"standard\"}")
  
  success=$(echo "$response" | jq -r '.success')
  
  if [ "$success" = "true" ]; then
    # Extract filename from URL
    filename=$(echo "$url" | sed 's|https\?://||' | sed 's|/|_|g')
    
    # Save image
    echo "$response" | jq -r '.image' | \
      sed 's/data:image\/png;base64,//' | \
      base64 -d > "screenshot_${filename}.png"
    
    echo "✅ Success: screenshot_${filename}.png"
  else
    error=$(echo "$response" | jq -r '.error')
    echo "❌ Failed: $error"
  fi
  
  # Rate limiting
  sleep 2
done
```

### Parallel Processing with xargs
```bash
# Create URLs file
cat > urls.txt << EOF
https://github.com
https://stripe.com
https://figma.com
https://vercel.com
EOF

# Process in parallel (limit to 3 concurrent)
cat urls.txt | xargs -I {} -P 3 bash -c '
  url="{}"
  echo "Processing $url..."
  
  response=$(curl -s -X POST http://localhost:3000/screenshot \
    -H "Content-Type: application/json" \
    -d "{\"url\": \"$url\"}")
  
  if echo "$response" | jq -e ".success" > /dev/null; then
    filename=$(echo "$url" | sed "s|https\?://||" | sed "s|/|_|g")
    echo "$response" | jq -r ".image" | \
      sed "s/data:image\/png;base64,//" | \
      base64 -d > "screenshot_${filename}.png"
    echo "✅ $url -> screenshot_${filename}.png"
  else
    echo "❌ $url failed"
  fi
'
```

## Error Handling

### Check for Errors
```bash
response=$(curl -s -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://invalid-url"}')

if echo "$response" | jq -e '.success' > /dev/null; then
  echo "Screenshot successful!"
  echo "$response" | jq '.processingTimeMs, .fileSize'
else
  echo "Screenshot failed:"
  echo "$response" | jq '.error'
  exit 1
fi
```

### Retry Logic
```bash
#!/bin/bash

take_screenshot_with_retry() {
  local url="$1"
  local max_attempts=3
  local attempt=1
  
  while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt/$max_attempts for $url"
    
    response=$(curl -s -X POST http://localhost:3000/screenshot \
      -H "Content-Type: application/json" \
      -d "{\"url\": \"$url\"}")
    
    if echo "$response" | jq -e '.success' > /dev/null; then
      echo "✅ Success on attempt $attempt"
      return 0
    else
      error=$(echo "$response" | jq -r '.error')
      echo "❌ Attempt $attempt failed: $error"
      
      if [ $attempt -lt $max_attempts ]; then
        echo "Retrying in 3 seconds..."
        sleep 3
      fi
    fi
    
    ((attempt++))
  done
  
  echo "❌ All attempts failed for $url"
  return 1
}

# Usage
take_screenshot_with_retry "https://github.com"
```

## Production Examples

### Health Monitoring
```bash
#!/bin/bash

# Health check script
check_service() {
  response=$(curl -s http://localhost:3000/health)
  status=$(echo "$response" | jq -r '.status')
  
  if [ "$status" = "healthy" ]; then
    echo "✅ Service is healthy"
    echo "$response" | jq '.uptime, .memory'
  else
    echo "❌ Service is unhealthy"
    echo "$response"
    exit 1
  fi
}

check_service
```

### Performance Testing
```bash
#!/bin/bash

# Simple performance test
echo "🚀 URLPixel Performance Test"
echo "============================"

start_time=$(date +%s)

for i in {1..5}; do
  echo "Test $i/5..."
  
  response=$(curl -s -X POST http://localhost:3000/screenshot \
    -H "Content-Type: application/json" \
    -d '{"url": "https://example.com"}')
  
  processing_time=$(echo "$response" | jq -r '.processingTimeMs')
  echo "  Processing time: ${processing_time}ms"
done

end_time=$(date +%s)
total_time=$((end_time - start_time))

echo "Total test time: ${total_time}s"
```

## Remote Deployment Testing

### Railway Deployment
```bash
# Test Railway deployment
RAILWAY_URL="https://your-app.railway.app"

curl -X POST $RAILWAY_URL/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "quality": "standard"
  }'
```

### Docker Container
```bash
# Test Docker container
curl -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "quality": "high"
  }'
```

## Debugging

### Verbose Output
```bash
curl -v -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

### Timing Information
```bash
curl -w "Total time: %{time_total}s\nHTTP code: %{http_code}\n" \
  -X POST http://localhost:3000/screenshot \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'
```

### Connection Testing
```bash
# Test if service is running
curl -f http://localhost:3000/health || echo "Service not available"
```
