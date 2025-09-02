/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    viewTransition: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.sanity.io",
        port: "",
      },
    ],
  },
  typedRoutes: true,
};
