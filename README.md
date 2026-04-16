# SIMAS (sistem monitoring masyarakat sehat)

Aplikasi pelaporan, monitoring, dan statistik penyakit.

## Stack

- Backend: Node.js + Express
- Database: MySQL
- Frontend: React (Vite)
- Storage (MVP): Local file storage

## Fitur MVP

- Laporan penyakit dengan upload foto
- Monitoring data laporan dengan filter wilayah dan penyakit
- Statistik penyakit (total laporan, total kasus baru, total kasus meninggal)

## Struktur Proyek

- `backend`: API Express + SQL schema
- `frontend`: React app

## Menjalankan Lokal

1. Siapkan database MySQL.
2. Jalankan SQL berikut:
   - `backend/sql/schema.sql`
   - `backend/sql/seed.sql`
3. Konfigurasi environment backend:
   - Copy `backend/.env.example` ke `backend/.env`
4. Konfigurasi frontend:
   - Copy `frontend/.env.example` ke `frontend/.env`
5. Jalankan backend:
   - `cd backend`
   - `npm install`
   - `npm run dev`
6. Jalankan frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## Endpoint Utama

- `GET /api/health`
- `GET /api/diseases`
- `POST /api/reports`
- `GET /api/reports`
- `GET /api/reports/:id`
- `GET /api/stats`

## Catatan Migrasi ke AWS

Storage sudah dipisahkan melalui service (`backend/src/config/storage.js`), sehingga migrasi dari local storage ke S3 dapat dilakukan pada fase berikutnya tanpa mengubah contract endpoint.
