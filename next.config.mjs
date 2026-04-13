import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["react-router-dom"] = path.resolve(
      "./src/lib/router-compat.tsx"
    );
    return config;
  },
};

export default nextConfig;
