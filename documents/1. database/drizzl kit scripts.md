# Workflow for drizzle-kit scripts

# `"db:generate"`: `"drizzle-kit generate"`

With this we generate SQL files for a migration that we plan on running

# `"db:push"`: `"drizzle-kit push"`

Perfect for development. Bad idea doing it in production.

Instead of doing migration (`equivalent for migration would be making git pull reqest and merging it`) we push (`equivalent would be direct git push to main branch`) directly to databse, wich is fine for development.

It is like: "Here you go, take your schema and push it to the database! I do not care what is in there!" (which is bad)

# `"db:migrate"`: `"drizzle-kit migrate"`

Takes all migrations that are saved to the folder and run them all.

**You mostly do this on production database** (Can do it in development branch of your datbase, but you don't really need to most of the time)

# `"db:studio"`: `"drizzle-kit studio"`

Spins up a web app which is visual database explorer or visual ui admin access to your datbase

# `"db:seed"`: `"node src/db/seed.ts"`

Our seed script
