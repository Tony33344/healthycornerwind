#!/bin/bash

# Test API Endpoints for healthy corner Platform
# Run this after deploying database schema

echo "🧪 Testing healthy corner API Endpoints..."
echo "=========================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Services API
echo "📋 Test 1: GET /api/services"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/services")
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $STATUS"
    echo "Response preview: $(echo $BODY | head -c 100)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Test 2: Menu API
echo "🍽️  Test 2: GET /api/menu"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/menu")
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $STATUS"
    echo "Response preview: $(echo $BODY | head -c 100)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Test 3: Schedules API
echo "📅 Test 3: GET /api/schedules"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/schedules")
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $STATUS"
    echo "Response preview: $(echo $BODY | head -c 100)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Test 4: Bookings API (GET)
echo "📖 Test 4: GET /api/bookings"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/bookings")
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $STATUS"
    echo "Response preview: $(echo $BODY | head -c 100)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Test 5: Contact API (POST with validation)
echo "📧 Test 5: POST /api/contact (with invalid data)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid","message":"Test"}')
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "400" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Validation working (Status: $STATUS)"
    echo "Response: $(echo $BODY | head -c 100)..."
else
    echo -e "${YELLOW}⚠ UNEXPECTED${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Test 6: Contact API (POST with valid data)
echo "✉️  Test 6: POST /api/contact (with valid data)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","subject":"Test","message":"This is a test message"}')
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "200" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $STATUS"
    echo "Response: $(echo $BODY | head -c 150)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Test 7: Newsletter API (POST)
echo "📬 Test 7: POST /api/newsletter"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/newsletter" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}')
STATUS=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$STATUS" = "200" ] || [ "$STATUS" = "201" ] || [ "$STATUS" = "409" ]; then
    echo -e "${GREEN}✓ PASS${NC} - Status: $STATUS"
    echo "Response: $(echo $BODY | head -c 150)..."
else
    echo -e "${RED}✗ FAIL${NC} - Status: $STATUS"
    echo "Response: $BODY"
fi
echo ""

# Summary
echo "=========================================="
echo "🏁 Test Summary"
echo "=========================================="
echo ""
echo "All endpoints tested!"
echo ""
echo "Next steps:"
echo "1. Check Supabase dashboard for data"
echo "2. Test admin interface at /admin/dashboard"
echo "3. Verify booking capacity checks"
echo ""
echo "Done! ✨"
