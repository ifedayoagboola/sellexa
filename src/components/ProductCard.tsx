'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import ProductImage from './ProductImage';
import SaveButton from './SaveButton';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price_pence: number;
    status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD';
    images: string[];
    city: string | null;
    category: string;
    profiles?: {
      handle: string;
      name: string | null;
      avatar_url: string | null;
    } | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  // Helper function to construct image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;

    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Construct the full Supabase storage URL with correct bucket name
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}` : null;
  };

  // Mock data for Fashion Nova style - using product ID for consistent values
  const productIdHash = product.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const hasDiscount = Math.abs(productIdHash) % 10 > 3; // 70% chance of discount
  const discountPercent = (Math.abs(productIdHash) % 50) + 20; // 20-70% off
  const originalPrice = Math.round(product.price_pence * (1 + discountPercent / 100));
  const hasRating = Math.abs(productIdHash) % 10 > 4; // 60% chance of rating
  const rating = 3 + (Math.abs(productIdHash) % 20) / 10; // 3-5 stars
  const reviewCount = (Math.abs(productIdHash) % 500) + 50; // 50-550 reviews

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
        {/* Product Image */}
        <div className="aspect-[5/5] relative overflow-hidden bg-slate-100 rounded-2xl">
          <ProductImage
            imageUrl={getImageUrl(product.images[0])}
            title={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
          />
          
          {/* Discount Badge - Top Left */}
          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-md">
                {discountPercent}% off
              </span>
            </div>
          )}
          
          {/* Heart Icon - Bottom Right */}
          <div className="absolute bottom-2 right-2">
            <SaveButton
              productId={product.id}
              productTitle={product.title}
              variant="icon-only"
              showToast={false}
              className="p-2 bg-white rounded-full hover:bg-white transition-all duration-200"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="p-2">
          {/* Title */}
          <h3 className="font-medium text-slate-900 text-sm leading-tight line-clamp-2">
            {product.title}
          </h3>
          
          {/* Rating (if available) */}
          {hasRating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(rating) ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({reviewCount})</span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-900">
              £{(product.price_pence / 100).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through">
                £{(originalPrice / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
