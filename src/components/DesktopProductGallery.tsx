'use client';

import { useState } from 'react';
import ProductImage from '@/components/ProductImage';

interface DesktopProductGalleryProps {
  images: string[];
  title: string;
}

export default function DesktopProductGallery({ images, title }: DesktopProductGalleryProps) {
  // Helper function to construct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}` : null;
  };
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">No images available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Product Image - Smaller size */}
      <div className="aspect-[3/2] bg-gray-100 rounded-xl overflow-hidden">
        <ProductImage
          imageUrl={getImageUrl(images[selectedImageIndex])}
          title={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Image Thumbnails - Clickable */}
      {images.length > 1 && (
        <div className="flex space-x-2">
          {images.slice(0, 4).map((image, index) => (
            <button 
              key={index} 
              className={`w-12 h-12 bg-gray-100 rounded-lg overflow-hidden transition-all ${
                selectedImageIndex === index 
                  ? 'ring-2 ring-[#1aa1aa]' 
                  : 'hover:ring-2 hover:ring-[#1aa1aa]'
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <ProductImage
                imageUrl={getImageUrl(image)}
                title={title}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
