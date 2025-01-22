/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ikv2ujhb4echbk1z.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
