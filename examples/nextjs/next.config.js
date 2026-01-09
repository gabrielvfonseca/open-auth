/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "open-auth",
    "@open-auth/core",
    "@open-auth/guardian",
    "@open-auth/magic",
    "@open-auth/mfa",
    "@open-auth/passkey",
    "@open-auth/session",
    "@open-auth/ui",
  ],
  experimental: {
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
};

module.exports = nextConfig;
