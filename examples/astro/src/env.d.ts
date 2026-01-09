/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    user: import("open-auth").User | null;
    session: import("open-auth").Session | null;
  }
}
