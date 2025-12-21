[Building api with express](https://github.com/Rade58/express-API) (completed)

## Dependancies

Installing all from root

```bash
#from root
pnpm add express ts-node zod --filter @lab/habits
```

- middlewares

```bash
# morgan - logging middleware
# helmet - securing with HTTP response headers
# cors - enabling CORS
pnpm add morgan \
 helmet \
 cors \
 --filter @lab/habits
```

- authentication

```bash
pnpm add jose --filter @lab/habits
```

```bash
# password hashing
pnpm add bcrypt --filter @lab/habits
```

---

- environment stuff

```bash
pnpm add custom-env dotenv --filter @lab/habits
```

---

- database stuff

```bash
pnpm add pg @epic-web/remember drizzle-orm drizzle-zod --filter @lab/habits
```

---

## Dev Dependancies

- typescript

```bash
pnpm add -D typescript tsx \
 @types/node \
 @types/bcrypt \
 @types/cors \
 @types/morgan \
 @types/express \
 @types/jest \
 @types/node \
 @types/supertest \
 --filter @lab/habits
```

- making sure environment variables works same on linux and windows

```bash
pnpm add -D cross-env --filter @lab/habits
```

- database migrator cli

```bash
pnpm add -D drizzle-kit --filter @lab/habits
```

- testing stuff

```bash
pnpm add -D vitest supertest --filter @lab/habits
```