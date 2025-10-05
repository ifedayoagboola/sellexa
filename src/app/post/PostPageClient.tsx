'use client';

import { useState } from 'react';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';
import { useCreatePost, PostFormData } from '@/hooks/useCreatePost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PostPageClientProps {
  user: any;
}

export default function PostPageClient({ user }: PostPageClientProps) {
  const { submitPost, isLoading, error, clearError } = useCreatePost();
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    price: '',
    category: 'FOOD',
    status: 'AVAILABLE',
    city: '',
    postcode: '',
    tags: '',
    images: []
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

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleCategoryChange = (category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER') => {
    setFormData(prev => ({ ...prev, category }));
  };

  const handleStatusChange = (status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD') => {
    setFormData(prev => ({ ...prev, status }));
  };

  const handleImagesChange = (images: File[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Please enter a valid price');
      return;
    }
    if (formData.images.length === 0) {
      alert('Please select at least one image');
      return;
    }

    await submitPost(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar user={user} />
      
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-sm font-medium text-gray-700">
              Photos (1-5 images)
            </Label>
            <ImageUpload
              images={formData.images}
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
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What are you selling?"
              required
            />
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
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
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
                  onClick={() => handleCategoryChange(category.value as any)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.category === category.value
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status *
            </Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
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
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="London"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postcode" className="text-sm font-medium text-gray-700">
                Postcode
              </Label>
              <Input
                id="postcode"
                type="text"
                value={formData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                placeholder="SW1A 1AA"
              />
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
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Tell us more about your product..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
              Tags (optional)
            </Label>
            <Input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="#garri #authentic #fresh"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with spaces or commas. Include # for hashtags.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1aa1aa] hover:bg-[#158a8f] h-12 text-base font-medium"
          >
            {isLoading ? 'Creating Post...' : 'Publish Post'}
          </Button>
        </form>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
}
