import type { NextConfig } from 'next';

const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const normalizedBasePath = configuredBasePath.replace(/^\/+|\/+$/g, '');
const basePath = normalizedBasePath ? `/${normalizedBasePath}` : '';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  basePath,
  output: isGitHubPages ? 'export' : undefined,
  trailingSlash: isGitHubPages,
  images: {
    unoptimized: isGitHubPages,
  },
};

export default nextConfig;
