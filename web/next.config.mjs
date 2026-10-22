// Standalone output, as clientweb: the image runs server.js without node_modules.
// /api/* is the API's, routed by the Ingress; locally, point it at the API.
export default {
  output: "standalone",
  async rewrites() {
    return process.env.API_URL
      ? [{ source: "/api/:path*", destination: `${process.env.API_URL}/api/:path*` }]
      : [];
  },
};
