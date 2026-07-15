/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      /* la vecchia pagina tickets del sito Cloudflare: chi ha il
         link non deve finire in 404 dopo lo switch DNS */
      { source: "/tickets", destination: "/events", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
};

export default nextConfig;
