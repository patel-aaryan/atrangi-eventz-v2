/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@atrangi/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-a7f4184a95ba4565bb338044ab53e028.r2.dev",
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
