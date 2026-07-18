import type { NextConfig } from "next";
import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  pageExtensions: ['mdx', 'ts', 'tsx'],
  output: 'standalone',
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
