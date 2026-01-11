# MongoDB Schema и Архитектура для Pin

## Обзор

Этот документ описывает структуру базы данных MongoDB для приложения Pin - сервиса городских задач на карте.

## Collections

### 1. pins (Основная коллекция пинов)

```json
{
  "_id": ObjectId,
  "title": String,                    // Заголовок задачи
  "description": String,              // Полное описание
  "price": Number,                    // Стоимость (опционально)
  "contact_info": {
    "phone": String,                  // Номер телефона
    "email": String,                  // Email (опционально)
    "telegram": String                // Username Telegram (опционально)
  },
  "location": {
    "type": "Point",                  // GeoJSON тип
    "coordinates": [lng, lat]         // [долгота, широта]
  },
  "created_at": Date,                 // Время создания
  "expires_at": Date,                 // Время истечения (1 час от создания)
  "is_active": Boolean,               // Активен ли пин
  "views_count": Number,              // Количество просмотров
  "owner_id": String,                 // ID владельца
  "owner_info": {
    "user_id": String,
    "phone": String,
    "username": String
  }
}
```

### 2. users (Информация о пользователях)

```json
{
  "_id": ObjectId,
  "telegram_id": String,              // Уникальный ID Telegram пользователя
  "username": String,                 // Username Telegram
  "phone": String,                    // Номер телефона
  "email": String,                    // Email
  "first_name": String,               // Имя
  "last_name": String,                // Фамилия
  "is_bot": Boolean,                  // Является ли ботом
  "language_code": String,            // Язык
  "preferred_contact_method": String, // Предпочтительный способ (phone/email/telegram)
  "profile_photo_url": String,        // URL фото профиля
  "created_at": Date,                 // Дата регистрации
  "updated_at": Date,                 // Дата последнего обновления
  "total_pins": Number,               // Всего создано пинов
  "total_views": Number,              // Всего просмотров всех пинов
  "ratings": Number                   // Рейтинг пользователя
}
```

### 3. pin_interactions (История взаимодействий)

```json
{
  "_id": ObjectId,
  "pin_id": ObjectId,                 // ID пина
  "user_id": String,                  // ID пользователя
  "action": String,                   // Тип действия: "view", "contact", "complete"
  "timestamp": Date,                  // Время действия
  "details": Object                   // Дополнительные данные
}
```

### 4. pin_reviews (Отзывы и рейтинги)

```json
{
  "_id": ObjectId,
  "pin_id": ObjectId,                 // ID пина
  "reviewer_id": String,              // ID того, кто оставляет отзыв
  "rating": Number,                   // Рейтинг (1-5)
  "comment": String,                  // Текст отзыва
  "created_at": Date,                 // Дата создания
  "helpful_count": Number             // Количество отметок "полезно"
}
```

## Индексы

### Основные индексы

```javascript
// По местоположению (для быстрого поиска по географии)
db.pins.createIndex({ location: '2dsphere' });

// По времени истечения (для удаления истекших пинов)
db.pins.createIndex({ expires_at: 1 });

// По дате создания (для сортировки)
db.pins.createIndex({ created_at: -1 });

// По владельцу (для отображения своих пинов)
db.pins.createIndex({ owner_id: 1 });

// Составной индекс для поиска активных пинов в определенном регионе
db.pins.createIndex({
  is_active: 1,
  created_at: -1,
  location: '2dsphere',
});

// TTL индекс для автоудаления истекших пинов
db.pins.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
```

## Основные операции

### 1. Создание пина

```javascript
db.pins.insertOne({
  title: 'Поехать в аэропорт',
  description: 'Нужна помощь с поездкой в аэропорт',
  price: 1100,
  contact_info: {
    phone: '+7 999 111 11 11',
  },
  location: {
    type: 'Point',
    coordinates: [37.6173, 55.7558], // [lng, lat]
  },
  created_at: new Date(),
  expires_at: new Date(Date.now() + 60 * 60 * 1000), // +1 час
  is_active: true,
  views_count: 0,
  owner_id: 'user_12345',
  owner_info: {
    user_id: 'user_12345',
    phone: '+7 999 111 11 11',
    username: 'john_doe',
  },
});
```

### 2. Поиск пинов по географии (в радиусе)

```javascript
// Поиск пинов в радиусе 5 км от точки
db.pins
  .find({
    is_active: true,
    expires_at: { $gt: new Date() },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [37.6173, 55.7558], // [lng, lat]
        },
        $maxDistance: 5000, // 5 км в метрах
      },
    },
  })
  .sort({ created_at: -1 })
  .limit(20);
```

### 3. Поиск своих пинов

```javascript
db.pins
  .find({
    owner_id: 'user_12345',
  })
  .sort({ created_at: -1 });
```

### 4. Обновление локации пина (перетаскивание)

```javascript
db.pins.updateOne(
  { _id: ObjectId('...') },
  {
    $set: {
      'location.coordinates': [37.62, 55.76],
      updated_at: new Date(),
    },
  }
);
```

### 5. Удаление пина

```javascript
db.pins.deleteOne({ _id: ObjectId('...') });
```

### 6. Увеличение счетчика просмотров

```javascript
db.pins.updateOne({ _id: ObjectId('...') }, { $inc: { views_count: 1 } });
```

## Автоматическое удаление истекших пинов

MongoDB автоматически удалит пины, у которых время в поле `expires_at` прошло, благодаря TTL индексу.

```javascript
db.pins.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
```

## Примеры запросов для фронтенда

### Загрузка пинов для карты

```typescript
// GET /pins?lat=55.7558&lng=37.6173&radius=5
const getPins = (lat: number, lng: number, radius: number = 5) => {
  // API должен возвращать пины в радиусе radius км
  return fetch(`/api/pins?lat=${lat}&lng=${lng}&radius=${radius}`);
};
```

### Создание пина

```typescript
// POST /pins
const createPin = (data: CreatePinData) => {
  return fetch('/api/pins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};
```

### Обновление локации

```typescript
// PATCH /pins/:id
const updatePinLocation = (pinId: string, lat: number, lng: number) => {
  return fetch(`/api/pins/${pinId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: { lat, lng },
    }),
  });
};
```

### Удаление пина

```typescript
// DELETE /pins/:id
const deletePin = (pinId: string) => {
  return fetch(`/api/pins/${pinId}`, {
    method: 'DELETE',
  });
};
```

## Безопасность

1. **Validation**: Все входные данные должны быть валидированы
2. **Authentication**: Требуется аутентификация через Telegram для создания пинов
3. **Authorization**: Пины могут быть обновлены/удалены только их владельцем
4. **Rate Limiting**: Ограничить количество пинов, которые пользователь может создать в час
5. **Spam Prevention**: Проверять на дубликаты и спам

## Миграция данных

Для миграции с json-server на MongoDB используйте следующий скрипт:

```javascript
// migration-script.js
const MongoClient = require('mongodb').MongoClient;
const pins = require('./db.json').pins;

MongoClient.connect('mongodb://localhost:27017', async (err, client) => {
  const db = client.db('pin_app');

  // Преобразуем данные из json-server
  const pinsWithGeometry = pins.map((pin) => ({
    ...pin,
    location: {
      type: 'Point',
      coordinates: [pin.location.lng, pin.location.lat],
    },
    created_at: new Date(pin.created_at),
    expires_at: new Date(pin.expires_at),
  }));

  await db.collection('pins').insertMany(pinsWithGeometry);
  console.log('Migration completed');
  client.close();
});
```
