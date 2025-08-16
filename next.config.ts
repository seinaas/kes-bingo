import { type NextConfig } from "next";

const imgUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

/**
 * @see https://nextjs.org/docs/api-reference/next.config.js/introduction
 */
export default {
  images: {
    remotePatterns: [new URL(imgUrl ? `${imgUrl}**` : "")],
  },
} satisfies NextConfig;
