#!/bin/bash

# Скрипт для настройки и запуска Pin приложения в Telegram Mini App

echo "================================"
echo "  Pin Telegram Mini App Setup"
echo "================================"
echo ""

# Проверка json-server
if ! command -v json-server &> /dev/null; then
    echo "❌ json-server не установлен. Установите зависимости: npm install"
    exit 1
fi

# Создание .env.local если не существует
if [ ! -f .env.local ]; then
    echo "📝 Создаю .env.local..."
    cat > .env.local << 'EOF'
# API URL для Telegram Mini App
# Используется для загрузки пинов и данных с сервера

# Локальная разработка
NEXT_PUBLIC_API_URL=http://localhost:3001

# Для Telegram Mini App используйте внешний URL туннеля
# Примеры: https://xxxxx-107-161-91-54.a.free.pinggy.link:3001 (для pinggy)
# Убедитесь, что json-server доступен на этом адресе
# NEXT_PUBLIC_API_URL=https://your-tunnel-url.com:3001
EOF
    echo "✅ .env.local создан"
fi

echo ""
echo "📌 Инструкция по запуску:"
echo ""
echo "1️⃣  Запустите json-server в отдельном терминале:"
echo "   npm run dev:server"
echo ""
echo "2️⃣  Создайте туннель (pinggy или ngrok):"
echo "   ssh -R 80:localhost:3000 -R 3001:localhost:3001 snhxv@a.free.pinggy.link"
echo ""
echo "3️⃣  Скопируйте URL туннеля и обновите .env.local"
echo ""
echo "4️⃣  Запустите приложение:"
echo "   npm run dev"
echo ""
echo "5️⃣  Откройте в Telegram Mini App"
echo ""
echo "📖 Подробнее: см. TELEGRAM_TUNNEL_SETUP.md"
echo ""
