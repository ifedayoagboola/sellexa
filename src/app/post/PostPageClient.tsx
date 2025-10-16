'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';
import { useCreatePost, PostFormData } from '@/hooks/useCreatePost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Validation schema
const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  price: z.string().min(1, 'Price is required').refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, 'Price must be a valid number greater than 0'),
  category: z.enum(['FOOD', 'FASHION', 'HAIR', 'HOME', 'CULTURE', 'OTHER']),
  status: z.enum(['AVAILABLE', 'RESTOCKING', 'SOLD']),
  city: z.string().optional(),
  postcode: z.string().optional(),
  tags: z.string().optional(),
});

type PostFormDataValidated = z.infer<typeof postSchema> & {
  images: File[];
};

interface PostPageClientProps {
  user: any;
}

export default function PostPageClient({ user }: PostPageClientProps) {
  const { submitPost, isLoading, error, clearError } = useCreatePost();
  
  const [images, setImages] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm<PostFormDataValidated>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      category: 'FOOD',
      status: 'AVAILABLE',
      city: '',
      postcode: '',
      tags: '',
      images: []
    }
  });

  const categories = [
    { value: 'FOOD', label: 'Food' },
    { value: 'FASHION', label: 'Fashion' },
    { value: 'HAIR', label: 'Hair' },
    { value: 'HOME', label: 'Home' },
    { value: 'CULTURE', label: 'Culture' },
    { value: 'OTHER', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'AVAILABLE', label: 'Available' },
    { value: 'RESTOCKING', label: 'Restocking' },
    { value: 'SOLD', label: 'Sold' }
  ];

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
    setValue('images', newImages);
  };

  const onSubmit = async (data: PostFormDataValidated) => {
    // Additional validation for images
    if (images.length === 0) {
      alert('Please select at least one image');
      return;
    }

    // Create PostFormData compatible object
    const postData: PostFormData = {
      ...data,
      description: data.description || '',
      images: images,
      city: data.city || '',
      postcode: data.postcode || '',
      tags: data.tags || ''
    };

    await submitPost(postData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-48 lg:pt-56">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create New Post
          </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-sm font-medium text-gray-700">
              Photos (1-5 images) *
            </Label>
            <ImageUpload
              images={images}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="What are you selling?"
              className={errors.title ? 'border-red-500 focus:border-red-500' : ''}
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              Price *
            </Label>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium text-foreground">£</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className={errors.price ? 'border-red-500 focus:border-red-500' : ''}
                {...register('price')}
              />
            </div>
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setValue('category', category.value as any)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    watch('category') === category.value
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status *
            </Label>
            <select
              id="status"
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                errors.status ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'
              }`}
              {...register('status')}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                City
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="London"
                className={errors.city ? 'border-red-500 focus:border-red-500' : ''}
                {...register('city')}
              />
              {errors.city && (
                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-sm font-medium text-gray-700">
                Postcode
              </Label>
              <Input
                id="postcode"
                type="text"
                placeholder="SW1A 1AA"
                className={errors.postcode ? 'border-red-500 focus:border-red-500' : ''}
                {...register('postcode')}
              />
              {errors.postcode && (
                <p className="text-sm text-red-600 mt-1">{errors.postcode.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <textarea
              id="description"
              rows={4}
              className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                errors.description ? 'border-red-500 focus-visible:ring-red-500' : 'border-input focus-visible:ring-ring'
              }`}
              placeholder="Tell us more about your product..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags (optional)
            </Label>
            <Input
              id="tags"
              type="text"
              placeholder="#garri #authentic #fresh"
              className={errors.tags ? 'border-red-500 focus:border-red-500' : ''}
              {...register('tags')}
            />
            {errors.tags && (
              <p className="text-sm text-red-600 mt-1">{errors.tags.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Separate tags with spaces or commas. Include # for hashtags.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-[#1aa1aa] hover:bg-[#158a8f] h-12 text-base font-medium"
          >
            {isLoading || isSubmitting ? 'Creating Post...' : 'Publish Post'}
          </Button>
        </form>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
}
