---
"@open-auth/device": patch
"@open-auth/guardian": patch
"@open-auth/identity": patch
"@open-auth/magic": patch
"@open-auth/mfa": patch
"@open-auth/oauth": patch
"@open-auth/passkey": patch
"@open-auth/password": patch
"@open-auth/recovery": patch
"@open-auth/sso": patch
"@open-auth/token": patch
"@open-auth/verification": patch
---

Fix the `types` entry point of the published packages. It pointed at `dist/src/index.d.ts`, a path that is never emitted, so consumers resolved the packages as untyped JavaScript. They now point at `dist/index.d.ts`.
