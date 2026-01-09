# Database API Reference

## Client

### `db`
The primary Prisma client instance.
- `db.user`: Operations on the User table.
- `db.identity`: Operations on the Identity table.
- `db.session`: Operations on the Session table.

## Key Functions

### `healthCheck()`
Verifies connection to the database.

### `seedDatabase()`
Utility for populating initial development data.

## Scripts

- `bun run prisma:generate`: Updates the TypeScript client.
- `bun run prisma:migrate`: Applies schema changes to the database.
