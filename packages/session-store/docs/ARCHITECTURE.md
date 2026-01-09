# Session Store Architecture

The Session-Store package is designed to be a "driver" layer for the Session service.

## Structure

```
src/
├── store.ts        # Base interface
├── redis-store.ts   # Redis implementation
├── memory-store.ts  # Memory implementation
├── types.ts        # Common types
└── index.ts        # Factory and exports
```

## Design Decisions

1. **Pluggability**: The `Session` service consumes the `SessionStore` interface, making it easy to swap backends without code changes.
2. **TTL Priority**: Time-to-live is managed by the store implementation (e.g., using Redis `EXPIRE`).
3. **Serialization**: Data is typically stored as JSON strings to maintain compatibility across different language clients (though primarily used in TS).
