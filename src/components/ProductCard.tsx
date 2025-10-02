'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductImage from './ProductImage';

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
  
  const hasDiscount = undefined
  const discountPercent = undefined
  const originalPrice = undefined
  const hasRating = undefined
  const rating = undefined
  const reviewCount = undefined

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <Card className="relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Product Image */}
        <div className="aspect-[5/5] relative overflow-hidden bg-slate-100">
          <ProductImage
            imageUrl={getImageUrl(product.images[0])}
            title={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge - Top Left */}
          {hasDiscount && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black text-white hover:bg-black">
                {discountPercent}% off
              </Badge>
            </div>
          )}
          
        </div>
        
        {/* Product Info */}
        <CardContent className="p-3 space-y-2">
          {/* Title */}
          <h3 className="text-slate-900 text-xs leading-tight line-clamp-2 group-hover:text-slate-700 transition-colors">
            {product.title}
          </h3>
          
          {/* Rating (if available) */}
          {hasRating && (
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(rating || 0) ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({reviewCount})</span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-900">
              £{(product.price_pence / 100).toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through">
                £{(originalPrice || 0 / 100).toFixed(2)}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
