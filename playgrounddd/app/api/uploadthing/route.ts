import { createRouteHandler } from "uploadthing/next";

import { fileRouter, ddFileRouter } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ddFileRouter,
});
