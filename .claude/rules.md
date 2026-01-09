# Coding Rules

1. **Logging**: Always use `consola` instead of `console.log` or `console.error`.
2. **Formatting**: Run `bun run format` (Biome) before committing. Format on save is enabled in VS Code.
3. **Types**: Use standard `open-auth` types from `@open-auth/core` or `@open-auth/auth`. Avoid `any` types.
4. **Imports**: Prefer `@open-auth/*` workspace imports over relative paths when possible.
5. **Validation**: Use Zod for runtime validation of inputs and outputs.
6. **Naming**: Use camelCase for variables/functions, PascalCase for classes/types, kebab-case for files.
7. **Testing**: Write tests with Vitest. Place test files next to source files with `.test.ts` extension.
8. **Error Handling**: Use Result types or throw typed errors, never return `null` for errors.
9. **Documentation**: Add JSDoc comments for public APIs and complex functions.
10. **Immutability**: Prefer immutable data structures and pure functions.
