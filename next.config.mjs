/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_DOMAIN],
    dangerouslyAllowSVG: true,
  },
  output: "standalone",
};

export default nextConfig;
