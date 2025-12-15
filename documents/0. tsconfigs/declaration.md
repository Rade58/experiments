## Why This Error Occurs

### The Problem

```typescript
// src/server.ts
const app = express();  // ❌ Error when declaration: true

export { app };  // Tries to export
```

**Error:**
```
The inferred type of 'app' cannot be named without a reference to 
'.pnpm/@types+express-serve-static-core@5.1.0/node_modules/@types/express-serve-static-core'. 
This is likely not portable. A type annotation is necessary.
```

### What's Happening

When you enable `declaration: true`, TypeScript tries to generate `.d.ts` files:

```typescript
// dist/server.d.ts (what TypeScript wants to generate)
import express from 'express';

export const app: ??? // ← What type to put here?
```

**The issue:**
1. TypeScript infers `app` has type from `@types/express-serve-static-core`
2. This type is **deeply nested** in node_modules
3. TypeScript doesn't know how to write a **portable** type reference in the `.d.ts` file
4. Solution: You must provide an **explicit type annotation**

---

## Why This Happens

### The Real Cause: `declaration: true`

```json
{
  "compilerOptions": {
    "declaration": true  // ← THIS is the cause
  }
}
```

When generating `.d.ts` files, TypeScript needs to write **explicit, portable type references**.

---

## The Solution

### Option 1: Add Explicit Type (Recommended)

```typescript
import express, { type Express } from 'express';

const app: Express = express();  // ✅ Explicit type

export { app };
```

**Generated `.d.ts`:**
```typescript
import { type Express } from 'express';

export const app: Express;  // ✅ Clean, portable
```

### Option 2: Use `satisfies` (TypeScript 4.9+)

```typescript
import express, { type Express } from 'express';

const app = express() satisfies Express;  // ✅ Type-checked but inferred

export { app };
```

**Benefits:**
- Type is still inferred (narrower type if applicable)
- TypeScript validates it matches `Express`
- Works with `declaration: true`

### Option 3: Don't Export (If Not Needed)

```typescript
const app = express();  // ✅ No error if not exported

// Use it internally
app.listen(3000);

// Don't export it
// export { app };  ← Remove this
```

If `app` is only used internally, no `.d.ts` export is needed, so no error.

### Option 4: Remove `declaration: true` (If Not a Library)

If `apps/habits` is an **application** (not a library), you don't need `.d.ts` files:

```json
// apps/habits/tsconfig.build.json
{
  "compilerOptions": {
    "declaration": false,  // ✅ No .d.ts generation
    "declarationMap": false  // Not needed either
  }
}
```

**When to use `declaration: true`:**
- ✅ Libraries/packages that others import
- ❌ Applications (standalone servers, CLIs)

---

## Understanding the Error Message

### Breaking Down the Error

```
The inferred type of 'app' cannot be named without a reference to 
'.pnpm/@types+express-serve-static-core@5.1.0/node_modules/@types/express-serve-static-core'.
```

**Translation:**

1. **"The inferred type of 'app'"**
   - TypeScript figured out `app` is type `Express`

2. **"cannot be named without a reference to"**
   - To write the type in `.d.ts`, TypeScript needs to import it

3. **"'.pnpm/@types+express-serve-static-core@...'"**
   - The type comes from a **deeply nested path** in node_modules

4. **"This is likely not portable"**
   - Other projects importing your package won't have the exact same path
   - The `.d.ts` file would be broken for them

5. **"A type annotation is necessary"**
   - You must explicitly write the type so TypeScript knows how to reference it

---

## Real-World Example

### The Inferred Type

```typescript
const app = express();

// TypeScript infers:
type InferredType = Express & {
  // ... lots of internal Express types from:
  // @types/express-serve-static-core/index.d.ts
  // @types/body-parser/index.d.ts
  // etc.
}
```

### What TypeScript Wants to Generate

```typescript
// dist/server.d.ts (broken)
import { ??? } from '???';  // ← What to import?

export const app: ???;  // ← How to write this type?
```

Without an explicit annotation, TypeScript doesn't know:
- Where to import the type from
- How to make it portable across different setups

### With Explicit Type

```typescript
// src/server.ts
import express, { type Express } from 'express';

const app: Express = express();

export { app };
```

**Generated `.d.ts`:**
```typescript
// dist/server.d.ts (clean!)
import { type Express } from 'express';

export const app: Express;  // ✅ Clear, portable reference
```

---

## When Does This Happen?

### ✅ Triggers the Error:

1. **Exporting the variable**
   ```typescript
   const app = express();
   export { app };  // ❌ Error
   ```

2. **With `declaration: true`**
   ```json
   { "declaration": true }  // ❌ Triggers check
   ```

3. **Complex inferred types from node_modules**
   ```typescript
   const app = express();  // Complex Express type
   const router = Router();  // Complex Router type
   ```

### ✅ Does NOT Trigger:

1. **Not exported**
   ```typescript
   const app = express();  // ✅ OK (internal only)
   ```

2. **No `declaration: true`**
   ```json
   { "declaration": false }  // ✅ No .d.ts generation
   ```

3. **Simple types**
   ```typescript
   const x = 5;  // ✅ OK (inferred as number)
   export { x };
   ```

---

---

## Recommended Solutions by Use Case

### Case 1: Application (Not a Library)

**Your situation:** `apps/habits` is a standalone server

```json
// apps/habits/tsconfig.build.json
{
  "compilerOptions": {
    "declaration": false,  // ✅ Apps don't need .d.ts
    "declarationMap": false
  }
}
```

**Why:** Applications aren't imported by other packages, so no need for type definitions.

### Case 2: Library/Package

**If `apps/habits` exports utilities for other packages:**

```typescript
// src/server.ts
import express, { type Express } from 'express';

export const app: Express = express();  // ✅ Explicit type

// Or with satisfies
export const app = express() satisfies Express;
```

### Case 3: Internal Module

**If `app` is only used internally:**

```typescript
// src/server.ts
const app = express();  // ✅ No export, no error

app.listen(3000);

// Don't export:
// export { app };  ← Remove
```

---

## Summary

### Why the Error?
- ✅ **Cause:** `declaration: true` + exporting inferred complex type
- ❌ **NOT:** `noImplicitAny` (that's for function params)

### The Issue:
TypeScript can't generate a **portable** `.d.ts` file without an explicit type annotation

### Solutions:

1. **Add explicit type** (if you need exports):
   ```typescript
   const app: Express = express();
   ```

2. **Use `satisfies`** (type-checked inference):
   ```typescript
   const app = express() satisfies Express;
   ```

3. **Disable `declaration`** (for apps):
   ```json
   { "declaration": false }
   ```

4. **Don't export** (if internal):
   ```typescript
   // Just use locally, don't export
   ```

### For Your Monorepo:

**If `apps/habits` is an application:**
```json
// tsconfig.build.json
{
  "declaration": false  // ✅ Recommended for apps
}
```

**If it's a library:**
```typescript
// src/server.ts
import { type Express } from 'express';

export const app: Express = express();  // ✅ Explicit type
```

**TL;DR:** The error is from `declaration: true` trying to generate `.d.ts` files. Either add explicit types or disable declaration generation for applications! 🎯