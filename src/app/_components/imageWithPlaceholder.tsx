import type { ImageProps } from "next/image";
import Image from "next/image";
import { useEffect, useState } from "react";

export function ImageWithPlaceholder({ src, alt, ...rest }: ImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const fallbackSrc = `/placeholder.png`;

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      {...rest}
      alt={alt}
      src={imgSrc}
      priority
      placeholder="blur"
      blurDataURL="/placeholder_48x48.png"
      onLoad={(e) => {
        if ((e as unknown as HTMLImageElement).naturalWidth === 0) {
          // Broken image
          setImgSrc(fallbackSrc);
        }
      }}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}
