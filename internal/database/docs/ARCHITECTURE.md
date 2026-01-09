# Database Architecture

The Database package is structured to separate schema definition from runtime access logic.

## Structure

```
.
├── prisma/
│   ├── schema.prisma   # Single source of truth for DB structure
│   └── migrations/     # Version-controlled SQL changes
├── src/
│   ├── client.ts       # Prisma client instantiation
│   ├── keys.ts         # Query key definitions
│   └── index.ts        # Exports
```

## Data Flow

1. **Definition**: Changes are made in `schema.prisma`.
2. **Migration**: `prisma migrate dev` creates a new migration file.
3. **Generation**: `prisma generate` creates the TypeScript client in `node_modules`.
4. **Access**: Other packages import `@open-auth/database` to interact with the data.
