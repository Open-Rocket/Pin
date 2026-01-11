#!/bin/bash

# Скрипт для проверки доступа к json-server через туннель

echo "=== Проверка доступа к json-server ==="
echo ""

# Локальная проверка
echo "1. Проверка локального доступа (localhost:3001)..."
curl -s http://localhost:3001/pins | head -20
echo ""
echo "---"
echo ""

# Проверка через туннель (если указан)
if [ -z "$1" ]; then
    echo "2. Для проверки через туннель передайте URL:"
    echo "   ./test-api.sh https://ваш-туннель-url.com:3001"
    exit 0
fi

API_URL=$1
echo "2. Проверка доступа через туннель: $API_URL"
echo ""

# Получить пины
echo "GET $API_URL/pins"
curl -v "$API_URL/pins" 2>&1 | head -30
echo ""
echo "---"
echo ""

# Попытка создать пин
echo "POST $API_URL/pins"
curl -X POST "$API_URL/pins" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Тестовый пин",
    "description": "Пин для проверки API",
    "price": 100,
    "location": {"lat": 55.75, "lng": 37.62},
    "contact_info": {"phone": "+7 999 999 99 99"},
    "owner_id": "test-user"
  }' 2>&1

echo ""
echo "Если вы видите JSON - туннель работает!"
