import * as React from "react";
import { ImageProps } from "@/types/components/recording/recording";

const ImageComponent: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img loading="lazy" src={src} alt={alt} className={className} />
);

export default ImageComponent;
