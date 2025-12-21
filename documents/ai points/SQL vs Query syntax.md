# SQL like syntax VS non-SQL (Query) syntax

```ts
 const userHabitsWithTags = await db.query.habits.findMany({
    where: eq(habits.userId, userId),
    with: {
      habitTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: [desc(habits.createdAt)],
  })

//               VS

const userHabitsWithTags = await db
    .select()
    .from(habitTags)
    .innerJoin(habits, eq(habits.id, habitTags.habitId))
    .innerJoin(tags, eq(tags.id, habitTags.tagId))
    .where(eq(habits.userId, userId))
    .orderBy(desc(habits.createdAt)) 

```



Great question! You're right that the SQL-like syntax gives you more control and helps you learn SQL better. Let me explain what's happening and how to solve the "bloated" results issue.

## Understanding the difference

**First syntax (Relational Query):**
- Returns a clean, nested structure
- Each habit has a `habitTags` array, each containing a `tag`
- Drizzle handles the grouping for you

**Second syntax (SQL-like Query):**
- Returns a **flat array** where each row is duplicated for every join
- If a habit has 3 tags, you get 3 separate objects with the full habit data repeated
- This is exactly how SQL JOIN works - it creates a Cartesian product

## The Solution: Manual Grouping

When using SQL-like syntax with joins, you need to group the results yourself:

```typescript
const rows = await db
  .select()
  .from(habits)
  .innerJoin(habitTags, eq(habits.id, habitTags.habitId))
  .innerJoin(tags, eq(tags.id, habitTags.tagId))
  .where(eq(habits.userId, userId))
  .orderBy(desc(habits.createdAt))

// Now transform the flat array into the nested structure you want
const userHabitsWithTags = rows.reduce((acc, row) => {
  const habitId = row.habits.id
  
  // Find or create the habit entry
  let habit = acc.find(h => h.id === habitId)
  if (!habit) {
    habit = {
      ...row.habits,
      tags: [] // or habitTags: [] depending on your preference
    }
    acc.push(habit)
  }
  
  // Add the tag to this habit
  habit.tags.push(row.tags)
  
  return acc
}, [] as Array<typeof habits.$inferSelect & { tags: Array<typeof tags.$inferSelect> }>)
```

## Alternative: Select Only What You Need

You can also be more explicit about which columns to return:

```typescript
const rows = await db
  .select({
    habitId: habits.id,
    habitName: habits.name,
    habitCreatedAt: habits.createdAt,
    // ... other habit fields you need
    tagId: tags.id,
    tagName: tags.name,
    // ... other tag fields you need
  })
  .from(habits)
  .innerJoin(habitTags, eq(habits.id, habitTags.habitId))
  .innerJoin(tags, eq(tags.id, habitTags.tagId))
  .where(eq(habits.userId, userId))
  .orderBy(desc(habits.createdAt))
```

## Does the Workshop Syntax Use Subqueries?

**No**, the relational query syntax (`db.query.habits.findMany`) doesn't use subqueries. Behind the scenes, Drizzle:
1. Makes separate queries (one for habits, one for tags)
2. Or uses JOINs and automatically groups the results for you

It's basically doing the same JOIN + grouping work you'd need to do manually, but it handles the transformation automatically.

## My Recommendation

If you want to learn SQL better:
- Use the SQL-like syntax for your queries
- Accept that you'll need to do manual grouping/transformation
- This is actually **good practice** because it's exactly what you'd do in raw SQL

The relational syntax is more convenient but abstracts away the SQL reality. The SQL-like syntax teaches you what's really happening, which aligns with your learning goal!