declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: import("open-auth").User | null;
      session: import("open-auth").Session | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
