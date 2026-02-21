/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@atrangi/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-0fc4eb5438334677bf58b5b720e88842.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
