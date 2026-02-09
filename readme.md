# Test Task

[The task itself](.github/assets/task.png)

## Stack

- **Runtime:** Node.js v24 (native TS transpilation)
- **Database:** PostgreSQL + PrismaORM
- **Docs:** Swagger

## Setup

```bash
npm install
# Configure .env.development
npm run prisma:push
npm run dev

```

API: `http://localhost:4000/api`

Docs: `http://localhost:4000/docs`
