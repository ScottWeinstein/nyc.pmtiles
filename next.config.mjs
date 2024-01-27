/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: () => {
    const exts = ['mvt', 'png', 'jpg', 'webp', 'avif'];
    return exts.map((ext) => ({ source: `/api/:name/:x/:y/:z.${ext}`, destination: `/api/:name/:x/:y/:z` }));
    // return [
    //   {
    //     source: '/api/:name/:x/:y/:z.pbf',
    //     destination: '/api/:name/:x/:y/:z',
    //   },
    //   {
    //     source: '/api/:name/:x/:y/:z.png',
    //     destination: '/api/:name/:x/:y/:z',
    //   },
    // ];
  },
};

export default nextConfig;
