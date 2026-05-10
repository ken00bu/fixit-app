import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'pub-27b6b6b763934d28afe5e079fa28234a.r2.dev',
      pathname: '/reports/**'
    }]
  }
};
export default nextConfig;
