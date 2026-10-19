/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static HTML export for GitHub Pages
  output: "export",

  // GitHub Pages serves from a root domain with custom domain, no basePath needed
  // If not using a custom domain, set basePath to "/OuterGazers"

  // Disable Next.js image optimization (not available with static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        // This wildcard allows any AWS S3 bucket to serve images to your app
        hostname: "**.s3.amazonaws.com", 
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        // Specific region wildcard format (e.g., s3.us-east-1.amazonaws.com)
        hostname: "**.s3.*.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
    // Optional: Increase cache TTL for heavy studio assets so they load instantly on return visits
    minimumCacheTTL: 86400, // 24 hours
  },

  // Suppress specific build warnings if utilizing experimental external packages (like GSAP or Lenis)
  webpack: (config) => {
    return config;
  },

  // Note: headers() are not supported with output: "export".
  // Configure security headers in your hosting provider instead.
};

export default nextConfig;