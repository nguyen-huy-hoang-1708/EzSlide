# Slides Designer — Project Skeleton

This repository contains a scaffold for a web application that lets users create slides, either manually or via AI, manage templates and assets, and export slides to files.

Tech stack (recommended):
- Backend: Node.js + Express + Prisma (SQLite or MySQL for dev)
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Auth: JWT

Screens included in the frontend skeleton match the UI screens defined in your spec.

## Local setup (macOS)

Server

1. Install Node.js 18+ and pnpm/yarn/npm.
2. Open the `backend` folder and install dependencies:

```bash
cd backend
npm install
```

3. Create environment file from example:

```bash
cp .env.example .env
# Customize .env as needed
```

4. Generate Prisma client and create a development database. For SQLite run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

To use MySQL instead of SQLite:
```bash
# 1. Edit `backend/.env` and set DATABASE_PROVIDER=mysql and set DATABASE_URL to your mysql://<user>:<password>@host:port/db
# 2. Run migrations
npx prisma generate
npx prisma migrate dev --name init
```
5. Seed data (optional):

```bash
npm run seed
```
```

6. Start backend in dev mode:

```bash
npm run dev
```

Frontend

1. Open a new terminal, go to `frontend` and install dependencies:

```bash
cd frontend
npm install
```

2. Start the dev server:

```bash
npm run dev
```

This README outlines the basics. See `backend/README.md` and `frontend/README.md` for more details.
