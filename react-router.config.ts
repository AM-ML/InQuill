import type { Config } from "@react-router/dev";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    v7_partialHydration: true,
    v7_relativeSplatPath: true
  }
} satisfies Config;
