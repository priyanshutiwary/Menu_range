// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable header handling for tenant/business information
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'x-business-id',
              value: ':x-business-id',
            },
            {
              key: 'x-business-subdomain',
              value: ':x-business-subdomain',
            },
          ],
        },
      ];
    },
  
    // Configure domains for Next.js Image component if you're using it
    images: {
      domains: ['ik.imagekit.io'], // Add your image domains here
    },
  
    // Add custom hostname handling for development
    async rewrites() {
      return {
        beforeFiles: [
          // Handle subdomain routes in development
          {
            source: '/:path*',
            has: [
              {
                type: 'host',
                value: '(?<subdomain>[^.]+).localhost:3000',
              },
            ],
            destination: '/:path*',
          },
        ],
      };
    },
    typescript: {
      ignoreBuildErrors: true, // Disable type checking during build
  },
  };
  
  export default nextConfig;