import * as React from 'react';
import { ImageProps } from '../../types/types';

export const ImageComponent: React.FC<ImageProps> = ({ src, alt, className }) => (
  <img
    loading="lazy"
    src={src}
    alt={alt}
    className={className}
  />
);