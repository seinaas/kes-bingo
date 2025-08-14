/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

const imgUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [new URL(imgUrl ? `${imgUrl}**` : "")],
  },
};

export default config;
