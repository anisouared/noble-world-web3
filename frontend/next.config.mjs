/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // Désactive ESLint pendant le build
    },
    // experimental: {
    //     appDir: true,
    // },
    // compiler: {
    //     styledComponents: true,
    // }
};

export default nextConfig;
