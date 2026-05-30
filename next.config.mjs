/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/about-cockroach-watch-india",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/latest",
        destination: "/live-newsroom",
        permanent: true,
      },
      {
        source: "/what-is-cwi",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
