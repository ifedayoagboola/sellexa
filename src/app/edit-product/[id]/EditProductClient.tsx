'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Navigation from '@/components/Navigation';
import ImageUpload from '@/components/ImageUpload';
import { useCreatePost, PostFormData } from '@/hooks/useCreatePost';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { parseTags } from '@/lib/posts';

interface EditProductClientProps {
  user: any;
  product: any;
}

export default function EditProductClient({ user, product }: EditProductClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PostFormData>({
    title: product.title || '',
    description: product.description || '',
    price: product.price_pence ? (product.price_pence / 100).toString() : '',
    category: product.category || 'FOOD',
    status: product.status || 'AVAILABLE',
    city: product.city || '',
    postcode: product.postcode || '',
    tags: Array.isArray(product.tags) ? product.tags.join(' ') : (product.tags || ''),
    images: []
  });

  const [imageReplacements, setImageReplacements] = useState<{ [key: number]: File }>({});
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

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
    if (error) setError(null);
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

  const handleReplaceImage = (index: number, file: File | null) => {
    if (file) {
      setImageReplacements(prev => ({ ...prev, [index]: file }));
    } else {
      setImageReplacements(prev => {
        const newReplacements = { ...prev };
        delete newReplacements[index];
        return newReplacements;
      });
    }
  };

  const handleDeleteImage = (index: number) => {
    if (imagesToDelete.includes(index)) {
      setImagesToDelete(prev => prev.filter(i => i !== index));
    } else {
      setImagesToDelete(prev => [...prev, index]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert price to pence
      const pricePence = Math.round(parseFloat(formData.price) * 100);

      // Prepare update data
      const updateData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price_pence: pricePence,
        category: formData.category,
        status: formData.status,
        city: formData.city.trim(),
        postcode: formData.postcode.trim(),
        tags: parseTags(formData.tags || ''),
        updated_at: new Date().toISOString()
      };

      // Handle image management
      const finalImages = [...(product.images || [])];
      const imagesToDeleteFromStorage: string[] = [];

      // Delete selected images
      imagesToDelete.forEach(index => {
        if (finalImages[index]) {
          imagesToDeleteFromStorage.push(finalImages[index]);
          finalImages[index] = null as any;
        }
      });

      // Replace selected images
      for (const [indexStr, file] of Object.entries(imageReplacements)) {
        const index = parseInt(indexStr);
        if (finalImages[index]) {
          imagesToDeleteFromStorage.push(finalImages[index]);
        }

        // Upload replacement image
        const fileExt = file.name.split('.').pop();
        const fileName = `${product.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImages[index] = publicUrl;
      }

      // Add new images
      for (const image of formData.images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${product.id}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImages.push(publicUrl);
      }

      // Delete old images from storage
      if (imagesToDeleteFromStorage.length > 0) {
        const imagePaths = imagesToDeleteFromStorage.map((url: string) => {
          const urlParts = url.split('/');
          return `products/${urlParts[urlParts.length - 1]}`;
        });

        const { error: deleteError } = await supabase.storage
          .from('product-images')
          .remove(imagePaths);

        if (deleteError) {
          console.warn('Failed to delete old images:', deleteError);
        }
      }

      // Filter out null values and update
      updateData.images = finalImages.filter(img => img !== null);

      // Update the product
      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Success - redirect to profile
      router.push('/profile');
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopBar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-48 lg:pt-56">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Product
          </h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Management */}
            <div className="space-y-4">
              <Label htmlFor="images" className="text-sm font-medium text-gray-700">
                Product Photos
              </Label>
              
              {/* Current Images */}
              {product.images && product.images.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">Current images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.images.map((image: string, index: number) => {
                      const isMarkedForDeletion = imagesToDelete.includes(index);
                      const hasReplacement = imageReplacements[index];
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className={`aspect-square rounded-lg overflow-hidden bg-gray-100 relative ${
                            isMarkedForDeletion ? 'opacity-50' : ''
                          }`}>
                            {hasReplacement ? (
                              <img
                                src={URL.createObjectURL(hasReplacement)}
                                alt={`Replacement ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={image}
                                alt={`Current ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            
                            {isMarkedForDeletion && (
                              <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">Marked for deletion</span>
                              </div>
                            )}
                            
                            {hasReplacement && !isMarkedForDeletion && (
                              <div className="absolute inset-0 bg-green-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">Replacement ready</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  handleReplaceImage(index, file);
                                }}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full text-xs"
                                disabled={isMarkedForDeletion}
                              >
                                Replace
                              </Button>
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteImage(index)}
                              className={`text-xs ${isMarkedForDeletion ? 'bg-red-50 text-red-600' : ''}`}
                            >
                              {isMarkedForDeletion ? 'Undo' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add New Images */}
              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">New images to add:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {formData.images.map((image: File, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload Component */}
              <ImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                maxImages={5 - (product.images?.length || 0) + imagesToDelete.length}
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
                <span className="text-lg font-medium text-gray-900">£</span>
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
                        ? 'bg-[#1aa1aa] text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
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
              <p className="text-xs text-gray-500">
                Separate tags with spaces or commas. Include # for hashtags.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/profile')}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#1aa1aa] hover:bg-[#158a8f]"
              >
                {isLoading ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <Navigation />
    </div>
  );
}
