import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  images: {
    // Allow SVG images to be used
    dangerouslyAllowSVG: true,
    // Allowed image domains
    domains: ['api.dicebear.com', 'res.cloudinary.com'],
    
    // Remote image patterns based on the environment
    remotePatterns: process.env.NODE_ENV === 'development'
      ? [ 
          {
            protocol: 'https',
            hostname: '**', // Allow all domains in dev for testing purposes (use with caution)
            pathname: '/**',
          },
        ]
      : [
          {
            protocol: 'https',
            hostname: 's3-bucket-name.s3.amazonaws.com',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cloudfront-domain.cloudfront.net',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '/**',
          },
        ],
  },
};

export default nextConfig;