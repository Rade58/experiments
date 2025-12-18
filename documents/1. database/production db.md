# Production dataabse should only be "touched" through CI/CD, github actions...

The claim "never have production DB URI on your computer" is about **where and how** you store/use it, not about whether migrations can be run against production at all.

Here's the typical workflow distinction:

### Local Development (Your Machine)
- You work with a **development/branch database** (like Neon branches)
- You write migrations and test them locally
- Your `.env` file contains only dev/staging URIs
- You commit migration files to git (the SQL files, not the connection strings)

### Production Migrations
- Migrations run against production through **CI/CD pipelines** (GitHub Actions, etc.)
- The production URI is stored as a **secret** in your CI/CD platform
- Your local machine never needs the production URI in plaintext
- The deployment pipeline pulls the secret and runs `drizzle-kit migrate` automatically

## Destructive operation

1. **Accidentally running destructive operations** (seed scripts, `db push` instead of `migrate`, dropping tables)
2. **Security risk** of having production credentials in your `.env` file that could be committed to git or compromised

It's NOT saying "production databases can never be touched" - rather, they should be touched through **controlled, automated processes** rather than manual commands from your laptop.

## In a Company Setting

- Junior/mid developers work on feature branches (both code AND database via Neon branches)
- They create and test migrations locally
- Senior engineers or DevOps review the migrations
- CI/CD automatically applies approved migrations to production
- Direct production access is limited to specific people for emergencies

## For Solo Projects

For your personal projects, you have more flexibility, but best practices would be:
- Still use CI/CD to run production migrations (even if you're the only one reviewing)
- Keep production URI in CI/CD secrets, not local `.env`
- Use Neon branches to test migrations before they hit production
- If you MUST run something manually against production, use a separate, carefully-named env file (like `.env.production`) that you never accidentally source

The key insight: **migrations are safe and necessary; the risk is HOW you execute them and what else you might accidentally run.**