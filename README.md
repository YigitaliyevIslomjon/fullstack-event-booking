# High-Load Event Booking System

Tadbirlarni bron qilish tizimi — race condition va ortiqcha sotuvga chidamli REST API va Next.js frontend.

## Texnologiyalar

| Qatlam      | Texnologiya                          |
|------------|--------------------------------------|
| Backend    | NestJS, PostgreSQL, Prisma, JWT      |
| Frontend   | Next.js 14+ (App Router), Tailwind, Zustand |
| Orchestration | Docker Compose                    |

---

## Talablar

- Node.js 20+
- Docker va Docker Compose (Docker bilan ishga tushirish uchun)
- Yoki lokal PostgreSQL (lokal ishga tushirish uchun)

---

## 1. Muhit o‘zgaruvchilari

**Umumiy (Docker Compose va root):** Loyiha rootida `.env` yarating — `.env.example` dan nusxa oling:

```bash
cp .env.example .env
```

To‘ldiring:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=booking_database

# JWT (production da kuchli secretlar ishlating)
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Backend port
PORT=3001

# Frontend — API manzili (Docker build va lokal uchun)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Lokal ishga tushirishda** har bir qatlam o‘z papkasidagi `.env.example` dan nusxa olib `.env` yaratadi:

- **Frontend:** `frontend/.env.example` → `frontend/.env` (asosan `NEXT_PUBLIC_API_URL`)
- **Backend:** `backend/.env.example` → `backend/.env` (`DATABASE_URL`, JWT, `PORT`)

---

## 2. Docker Compose bilan ishga tushirish

Rootda `.env` bo‘lishi kerak (1-bo‘limda `.env.example` dan nusxa oling va Frontend: frontend/.env.example → frontend/.env. Keyin:

```bash
docker compose up --build
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:3001  
- **PostgreSQL:** localhost:5433 (host port)

DB migratsiya va seed avtomatik ishlaydi.

---

## 3. Lokal ishga tushirish (Dockersiz)

### 3.1 PostgreSQL

PostgreSQL 15+ ishlatiling. `.env` dagi `POSTGRES_*` ga mos database yarating va `DATABASE_URL` ni backend uchun belgilang.

### 3.2 Backend

```bash
cd backend
npm install
cp ../.env .env   # yoki DATABASE_URL ni backend/.env da ko'rsating
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

API: http://localhost:3001

### 3.3 Frontend

```bash
cd frontend
npm install
# .env da NEXT_PUBLIC_API_URL=http://localhost:3001 bo'lishi kerak
npm run dev
```

Veb: http://localhost:3000

---

## 4. Test hisoblari (seed dan)

Barcha foydalanuvchilar paroli: **`Password123`**

| Email             | Ism           |
|-------------------|----------------|
| john@example.com  | John Doe       |
| jane@example.com  | Jane Smith     |
| bob@example.com   | Bob Johnson    |
| …                 | (yana 7 ta)    |

Kirish: **Login** → email + `Password123` → **Sign In**.

---

## 5. Asosiy funksiyalar

- **Ro‘yxatdan o‘tish / Kirish** — `/register`, `/login`
- **Tadbirlar ro‘yxati** — `/events` (qidiruv, saralash, sahifalash)
- **Tadbir tafsiloti va bron** — `/events/[id]` → "Book Now"
- **Mening bronlarim** — `/bookings` (bekor qilish)

---

## 6. Parallellik testi (backend)

2 ta chiptali tadbirga 10 ta parallel bron so‘rovi — faqat 2 tasi muvaffaqiyatli bo‘lishi kerak:

```bash
cd backend
npm install
npm run test:concurrency
```

Kutilgan: `Muvaffaqiyatli bronlar: 2`, `Rad etilgan: 8`, `TEST O'TDI`.

---

## 7. Kerakli bo‘lsa

- **API hujjatlari:** `GET/POST /events`, `POST /auth/login`, `POST /auth/register`, `POST /book`, `GET/DELETE /bookings` va h.k. — backend `src` ichida controller/service orqali topiladi.
- **Lokal DB:** `psql` yoki DBeaver bilan `DATABASE_URL` orqali ulaning.
- **Xatoliklar:** Backend/frontend loglarini va `.env` (port, secret, `NEXT_PUBLIC_API_URL`) ni tekshiring.
