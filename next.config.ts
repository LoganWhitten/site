import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  output: 'standalone',
  allowedDevOrigins: ['192.168.86.139']
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
