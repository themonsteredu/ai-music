import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Prisma 쿼리 엔진이 서버리스 함수에 올바르게 포함되도록 외부 패키지로 처리.
  serverExternalPackages: ['@prisma/client', 'prisma'],
};

export default nextConfig;
