# Запуск Pin приложения с Telegram Mini App через туннель

## Шаг 1: Запустите json-server

```bash
npm run dev:server
```

json-server будет запущен на `http://localhost:3001`

## Шаг 2: В другом терминале создайте туннель через pinggy (или ngrok)

### Для pinggy.io:

```bash
ssh -R 80:localhost:3000 -R 3001:localhost:3001 snhxv@a.free.pinggy.link
```

Это создаст туннели:

- `https://xxx.a.free.pinggy.link` → `localhost:3000` (Next.js приложение)
- Порт 3001 также доступен для json-server

### Для ngrok:

```bash
ngrok http --domain=your-ngrok-domain.ngrok.io 3000
ngrok http 3001 --domain=your-ngrok-domain-2.ngrok.io
```

## Шаг 3: Скопируйте URL туннеля json-server

Например: `https://snhxv-107-161-91-54.a.free.pinggy.link:3001`

## Шаг 4: Обновите .env.local

```env
NEXT_PUBLIC_API_URL=https://ваш-туннель-url.com:3001
```

## Шаг 5: Запустите Next.js

```bash
npm run dev
```

## Шаг 6: Откройте мини-приложение в Telegram

1. Откройте вашего бота в Telegram
2. Нажмите кнопку "Открыть приложение"
3. Приложение откроется в полноэкранном режиме с залочённой ориентацией (портретный режим)
4. Кнопка закрытия (X) будет в верхней части - нажмите её для выхода

## Отладка

Если данные не загружаются:

1. **Проверьте консоль браузера** (F12) на ошибки сети
2. **Проверьте .env.local** - убедитесь что API URL правильный и активирован
3. **Проверьте доступ к json-server**:
   ```bash
   curl https://ваш-туннель-url.com:3001/pins
   ```
4. **Проверьте логи** в консоли браузера - там будут логи API запросов с полным URL

## Важно!

- Туннель работает с **HTTPS** (не HTTP) для безопасности
- Убедитесь что json-server слушает на порту 3001 (по умолчанию)
- При использовании pinggy убедитесь что оба сервиса доступны через туннель
