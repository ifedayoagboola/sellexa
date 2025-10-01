'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';
import { useCreatePost, PostFormData } from '@/hooks/useCreatePost';

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
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">
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
            <label className="block text-sm font-medium text-foreground">
              Photos (1-5 images)
            </label>
            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="What are you selling?"
              required
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Price *
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-lg">£</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Category *
            </label>
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
            <label className="block text-sm font-medium text-foreground">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <label className="block text-sm font-medium text-foreground">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="London"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Postcode
              </label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="SW1A 1AA"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Tell us more about your product..."
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Tags (optional)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="#garri #authentic #fresh"
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with spaces or commas. Include # for hashtags.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Post...' : 'Publish Post'}
          </button>
        </form>
      </div>
      
      <Navigation />
    </div>
  );
}
