/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Thêm dòng này
  },
  typescript: {
    ignoreBuildErrors: true, // Nếu bạn dùng TS thì thêm dòng này luôn
  },
  images: { unoptimized: true }
};
export default nextConfig;