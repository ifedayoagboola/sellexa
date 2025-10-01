'use client';

import { useState } from 'react';

interface ProductImageProps {
  imageUrl: string | null;
  title: string;
  className?: string;
}

export default function ProductImage({ imageUrl, title, className = "w-full h-full object-cover" }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!imageUrl || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        {hasError ? 'Image unavailable' : 'No image'}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}