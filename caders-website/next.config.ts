import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    // Content Security Policy:
    // - scripts: self + unsafe-inline (Next.js theme script) + unsafe-eval in dev mode for React callstacks & Turbopack/HMR
    // - styles: self + Google Fonts CDN
    // - images: self + data URIs + Supabase storage
    // - frames: Google Maps embed
    // - connect: self + Supabase + dev WebSockets (HMR)
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co",
      "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com https://*.google.com.bd",
      `connect-src 'self' https://*.supabase.co wss://*.supabase.co${isDev ? " ws: http:" : ""}`,
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 20 MB — enough for most PDF/PPTX files
      bodySizeLimit: "20mb",
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;