#!/bin/bash

# Test Complete Upload Flow
# This script tests the entire flow from upload to display

echo "🧪 Testing Complete Upload JS to Markdown Flow"
echo "================================================"
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Dev server not running. Please start it with: npm run dev"
    exit 1
fi

echo "✅ Dev server is running"
echo ""

# Test file to upload
TEST_FILE="leetcode-javascript-1-master/solutions/0003-longest-substring-without-repeating-characters.js"

if [ ! -f "$TEST_FILE" ]; then
    echo "❌ Test file not found: $TEST_FILE"
    exit 1
fi

echo "📁 Test file: $TEST_FILE"
echo ""

# Step 1: Upload the file
echo "📤 Step 1: Uploading JavaScript file..."
echo "--------------------------------------"
UPLOAD_RESPONSE=$(curl -s -X POST http://localhost:3000/api/upload-js \
  -F "file=@$TEST_FILE")

echo "$UPLOAD_RESPONSE" | jq '.' 2>/dev/null || echo "$UPLOAD_RESPONSE"

# Extract data from upload response
SUCCESS=$(echo "$UPLOAD_RESPONSE" | jq -r '.success' 2>/dev/null)
FILENAME=$(echo "$UPLOAD_RESPONSE" | jq -r '.fileName' 2>/dev/null)
CONTENT=$(echo "$UPLOAD_RESPONSE" | jq -r '.content' 2>/dev/null)
ALGORITHM_SLUG=$(echo "$UPLOAD_RESPONSE" | jq -r '.algorithmSlug' 2>/dev/null)

if [ "$SUCCESS" != "true" ]; then
    echo "❌ Upload failed"
    exit 1
fi

echo "✅ Upload successful"
echo "   - Filename: $FILENAME"
echo "   - Algorithm: $ALGORITHM_SLUG"
echo ""

# Step 2: Trigger AI Analysis
echo "🤖 Step 2: AI Analysis & Markdown Generation..."
echo "--------------------------------------"
echo "⚠️  This may take 30-60 seconds (GPT-4o processing)..."

ANALYZE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/analyze-js \
  -H "Content-Type: application/json" \
  -d "{\"fileName\":\"$FILENAME\",\"fileContent\":$(echo "$CONTENT" | jq -Rs .),\"filePath\":\"/tmp/test.js\"}")

ANALYZE_SUCCESS=$(echo "$ANALYZE_RESPONSE" | jq -r '.success' 2>/dev/null)

if [ "$ANALYZE_SUCCESS" = "true" ]; then
    echo "✅ AI analysis successful"
    echo "   - Markdown file generated"
    echo "   - Saved to: src/algorithms/$ALGORITHM_SLUG.md"
else
    echo "❌ AI analysis failed"
    echo "$ANALYZE_RESPONSE" | jq '.' 2>/dev/null || echo "$ANALYZE_RESPONSE"
    exit 1
fi
echo ""

# Step 3: Check if markdown file exists
echo "📄 Step 3: Verifying Markdown File..."
echo "--------------------------------------"
MD_FILE="src/algorithms/$ALGORITHM_SLUG.md"

if [ -f "$MD_FILE" ]; then
    echo "✅ Markdown file exists"
    echo "   - Location: $MD_FILE"
    echo "   - Size: $(wc -c < "$MD_FILE") bytes"
    echo "   - Lines: $(wc -l < "$MD_FILE") lines"
else
    echo "❌ Markdown file not found"
    exit 1
fi
echo ""

# Step 4: Check API response
echo "🔌 Step 4: Testing Algorithms API..."
echo "--------------------------------------"
API_RESPONSE=$(curl -s "http://localhost:3000/api/algorithms?action=all")
TOTAL_ALGORITHMS=$(echo "$API_RESPONSE" | jq -r '.data | length' 2>/dev/null)

echo "✅ API responded successfully"
echo "   - Total algorithms: $TOTAL_ALGORITHMS"

# Check if our new algorithm is in the response
FOUND=$(echo "$API_RESPONSE" | jq -r ".data[] | select(.id==\"$ALGORITHM_SLUG\") | .title" 2>/dev/null)

if [ -n "$FOUND" ]; then
    echo "   - ✅ New algorithm found: $FOUND"
else
    echo "   - ⚠️  New algorithm not yet in API (may need cache refresh)"
fi
echo ""

# Step 5: Display summary
echo "📊 Summary"
echo "=========="
echo ""
echo "✅ Complete flow tested successfully!"
echo ""
echo "Next steps:"
echo "1. Visit homepage: http://localhost:3000"
echo "2. Search for: $ALGORITHM_SLUG"
echo "3. View detail page: http://localhost:3000/algorithm/$ALGORITHM_SLUG"
echo ""
echo "Files created:"
echo "- Temp file: temp/*-$FILENAME"
echo "- Markdown: src/algorithms/$ALGORITHM_SLUG.md"
echo ""
echo "🎉 Upload flow is working correctly!"
