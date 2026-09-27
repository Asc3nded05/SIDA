# SIDA Club Website Starter

Full-stack starter for the Student Independent Designers and Artists (SIDA) club.

## Stack

- Frontend: React + TypeScript + Vite + React Router + Tailwind CSS v4
- Backend: NestJS + TypeScript
- Database: PostgreSQL + Prisma
- Authentication/uploads: planned next layer

## Project structure

```text
sida-club/
├─ apps/
│  ├─ web/   # public/member/leadership React application
│  └─ api/   # NestJS REST API
└─ README.md
```

## Frontend setup

```bash
cd apps/web
npm install
npm run dev
```

The frontend currently uses mock data so the pages can be designed before the database/API is connected.

## Backend setup

Use Node.js 20+.

```bash
cd apps/api
npm install
cp .env.example .env
npm run start:dev
```

The API health endpoint is available at `http://localhost:3000/api/health`.

## Database

After PostgreSQL is available and `DATABASE_URL` is configured:

```bash
cd apps/api
npx prisma generate
npx prisma migrate dev --name init
```

## Important implementation order

1. Finish public pages and responsive layout.
2. Add PostgreSQL/Prisma repositories and seed data.
3. Add authentication with role-based access (`MEMBER`, `LEADERSHIP`).
4. Add secure media uploads using object storage rather than storing large files in PostgreSQL.
5. Add member work submission/review workflow.
6. Add commission request storage and leadership assignment/status workflow.
7. Add comments/recommendations only after the core workflow is stable.

Do not put passwords, session secrets, or database credentials in source control.
