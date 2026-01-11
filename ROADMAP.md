# ROADMAP - MVP Implementation для Pin

## Видение MVP

MVP Pin — это минимально жизнеспособный продукт, который позволяет пользователям создавать временные задачи на карте и находить людей поблизости для их выполнения. Основной фокус на простоте, прямом контакте и отсутствии посредников.

---

## Архитектура системы

### Технологический стек

**Frontend:**
- **Next.js 14+** (App Router)
- **TypeScript**
- **React Map GL / Leaflet** (для карты)
- **Tailwind CSS** (стилизация)
- **Zustand / React Context** (state management)
- **React Query / SWR** (data fetching)

**Backend:**
- **FastAPI** (Python 3.11+)
- **PostgreSQL** (основная БД)
- **PostGIS** (геопространственные данные)
- **Redis** (кеширование и временное хранение)
- **SQLAlchemy** (ORM)
- **Pydantic** (валидация данных)
- **Alembic** (миграции)

**Инфраструктура:**
- **Docker & Docker Compose** (разработка)
- **GitHub Actions** (CI/CD)
- **Nginx** (reverse proxy для production)

---

## Основные функции MVP

### 1. Карта с Pins
- Интерактивная карта города
- Отображение активных Pins в радиусе видимости
- Фильтрация по расстоянию (по умолчанию ~5-10 км)
- Автоматическое обновление Pins при перемещении карты

### 2. Создание Pin
- Клик на карту для размещения Pin
- Форма создания:
  - Заголовок задачи (обязательно)
  - Описание задачи (обязательно)
  - Цена/вознаграждение (опционально)
  - Контактная информация (телефон/Telegram/Email)
  - Время жизни Pin (по умолчанию 24 часа, максимум 7 дней)
- Валидация данных перед созданием

### 3. Просмотр Pin
- Модальное окно/страница с деталями Pin
- Отображение:
  - Заголовок и описание
  - Цена (если указана)
  - Контактная информация
  - Время создания и оставшееся время жизни
  - Точное местоположение на карте
- Кнопка "Связаться" (открывает контакт)

### 4. Управление своими Pins
- Личный кабинет/профиль
- Список созданных Pins:
  - Активные
  - Истекшие
- Возможность удалить активный Pin
- Возможность продлить время жизни Pin

### 5. Базовые настройки
- Выбор языка (русский/английский)
- Настройка радиуса видимости Pins
- Уведомления (опционально, для будущих версий)

---

## Структура базы данных

### Таблица `users`
```sql
- id (UUID, primary key)
- created_at (timestamp)
- updated_at (timestamp)
- phone (varchar, optional)
- email (varchar, optional)
- telegram (varchar, optional)
- preferred_contact_method (enum: phone/email/telegram)
- language (varchar, default: 'ru')
- is_active (boolean, default: true)
```

### Таблица `pins`
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key -> users.id)
- title (varchar, not null)
- description (text, not null)
- price (decimal, optional)
- contact_info (jsonb) -- {phone, email, telegram}
- location (geometry, PostGIS Point)
- created_at (timestamp)
- expires_at (timestamp)
- is_active (boolean, default: true)
- views_count (integer, default: 0)
```

### Индексы
- `pins.location` (GIST индекс для геопространственных запросов)
- `pins.expires_at` (для очистки истекших Pins)
- `pins.user_id` (для быстрого поиска Pins пользователя)
- `pins.is_active` (для фильтрации активных Pins)

---

## API Endpoints (FastAPI)

### Аутентификация (базовая для MVP)
```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Pins
```
GET    /api/v1/pins                    # Получить Pins в радиусе (query: lat, lng, radius)
GET    /api/v1/pins/{pin_id}           # Получить детали Pin
POST   /api/v1/pins                    # Создать новый Pin
DELETE /api/v1/pins/{pin_id}           # Удалить свой Pin
PATCH  /api/v1/pins/{pin_id}           # Обновить Pin (продлить время жизни)
GET    /api/v1/pins/my                 # Получить свои Pins
POST   /api/v1/pins/{pin_id}/view      # Увеличить счетчик просмотров
```

### Пользователи
```
GET    /api/v1/users/me                # Получить свой профиль
PATCH  /api/v1/users/me                # Обновить профиль
```

---

## Frontend структура (Next.js)

```
/app
  /(auth)
    /login
    /register
  /(main)
    /                    # Главная страница с картой
    /pin/[id]            # Страница деталей Pin
    /profile             # Личный кабинет
    /create              # Создание нового Pin
  /api                   # API routes (если нужны)
/components
  /map
    Map.tsx              # Основной компонент карты
    PinMarker.tsx        # Маркер Pin на карте
    CreatePinModal.tsx   # Модальное окно создания Pin
  /pin
    PinCard.tsx          # Карточка Pin
    PinDetails.tsx       # Детальный вид Pin
  /layout
    Header.tsx
    Footer.tsx
/lib
  /api                  # API клиент
  /utils                # Утилиты
  /types                # TypeScript типы
  /hooks                # Custom hooks
/public
  /images
  /icons
```

---

## Этапы реализации MVP

### Этап 1: Backend Foundation (1-2 недели)
- [ ] Настройка проекта FastAPI
- [ ] Настройка PostgreSQL + PostGIS
- [ ] Создание моделей SQLAlchemy (User, Pin)
- [ ] Миграции Alembic
- [ ] Базовая аутентификация (JWT или session-based)
- [ ] CRUD операции для Pins
- [ ] Геопространственные запросы (поиск Pins в радиусе)
- [ ] Валидация данных (Pydantic)
- [ ] Базовые тесты API

### Этап 2: Frontend Foundation (1-2 недели)
- [ ] Настройка Next.js проекта
- [ ] Интеграция карты (React Map GL или Leaflet)
- [ ] Базовый layout (Header, Footer)
- [ ] Страницы: главная, логин, регистрация
- [ ] API клиент (fetch/axios)
- [ ] State management
- [ ] Базовые компоненты UI

### Этап 3: Интеграция карты и Pins (1-2 недели)
- [ ] Отображение Pins на карте
- [ ] Загрузка Pins при перемещении карты
- [ ] Клик на карту для создания Pin
- [ ] Модальное окно создания Pin
- [ ] Валидация формы на фронте
- [ ] Отображение деталей Pin при клике
- [ ] Обновление Pins в реальном времени (polling или WebSocket)

### Этап 4: Профиль и управление (1 неделя)
- [ ] Страница профиля
- [ ] Список своих Pins
- [ ] Удаление Pin
- [ ] Продление времени жизни Pin
- [ ] Редактирование контактной информации

### Этап 5: Полировка и оптимизация (1 неделя)
- [ ] Обработка ошибок
- [ ] Loading states
- [ ] Оптимизация запросов (кеширование)
- [ ] Адаптивный дизайн
- [ ] Очистка истекших Pins (background task)
- [ ] Логирование
- [ ] Документация API (Swagger/OpenAPI)

### Этап 6: Тестирование и деплой (1 неделя)
- [ ] E2E тесты критических сценариев
- [ ] Настройка Docker Compose для разработки
- [ ] Подготовка к production
- [ ] CI/CD pipeline
- [ ] Деплой на staging
- [ ] Финальное тестирование

---

## Технические решения

### Геопространственные запросы
```python
# Пример запроса Pins в радиусе
from sqlalchemy import func
from geoalchemy2 import functions as geo_func

def get_pins_in_radius(lat: float, lng: float, radius_km: float = 5.0):
    point = func.ST_SetSRID(func.ST_MakePoint(lng, lat), 4326)
    distance = geo_func.ST_Distance(
        Pin.location,
        point
    ) * 111.0  # примерное преобразование в км
    return db.query(Pin).filter(
        distance <= radius_km,
        Pin.is_active == True,
        Pin.expires_at > datetime.utcnow()
    ).all()
```

### Валидация данных
- Frontend: React Hook Form + Zod
- Backend: Pydantic models

### Безопасность
- CORS настройки
- Rate limiting (для защиты от спама)
- Валидация всех входных данных
- Sanitization текстовых полей
- HTTPS в production

### Производительность
- Redis для кеширования популярных запросов
- Пагинация для списков
- Lazy loading на карте
- Оптимизация SQL запросов

---

## Что НЕ входит в MVP

- Система рейтингов и отзывов
- Внутренний мессенджер
- Уведомления в реальном времени
- Платежная система
- Модерация контента (автоматическая)
- Мобильные приложения (iOS/Android)
- Push-уведомления
- История выполненных задач
- Социальные функции (подписки, избранное)

---

## Метрики успеха MVP

1. Пользователь может создать Pin за < 2 минут
2. Pins отображаются на карте в реальном времени
3. Время ответа API < 200ms для геозапросов
4. Система стабильно работает с 100+ активными Pins
5. Нет критических багов в основных сценариях

---

## Следующие шаги после MVP

1. Система модерации контента
2. Улучшенная система поиска и фильтров
3. Мобильные приложения
4. Система рейтингов
5. Внутренний мессенджер
6. Аналитика и статистика
7. Мультиязычность
8. Интеграция с социальными сетями

---

**Общее время разработки MVP: 6-8 недель** (при работе 1-2 разработчиков)
