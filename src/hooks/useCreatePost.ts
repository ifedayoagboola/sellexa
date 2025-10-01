'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImages, createPost, parseTags, poundsToPence, CreatePostData } from '@/lib/posts';
import { useLoadingStore } from '@/stores/loadingStore';

export interface PostFormData {
    title: string;
    description: string;
    price: string;
    category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER';
    status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD';
    city: string;
    postcode: string;
    tags: string;
    images: File[];
}

export function useCreatePost() {
    const router = useRouter();
    const { setLoading, isLoading } = useLoadingStore();
    const [error, setError] = useState<string | null>(null);

    const submitPost = useCallback(async (formData: PostFormData) => {
        setError(null);
        setLoading(true, 'Creating your post...');

        try {
            // Upload images first
            if (formData.images.length === 0) {
                throw new Error('Please select at least one image');
            }

            const uploadResult = await uploadImages(formData.images);
            if (!uploadResult.success || !uploadResult.urls) {
                throw new Error(uploadResult.error || 'Failed to upload images');
            }

            // Prepare post data
            const postData: CreatePostData = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                price_pence: poundsToPence(parseFloat(formData.price) || 0),
                category: formData.category,
                status: formData.status,
                images: uploadResult.urls,
                city: formData.city.trim() || undefined,
                postcode: formData.postcode.trim() || undefined,
                tags: parseTags(formData.tags)
            };

            // Create the post
            const result = await createPost(postData);
            if (!result.success) {
                throw new Error(result.error || 'Failed to create post');
            }

            // Redirect to the new product page
            router.push(`/product/${result.productId}`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
            setError(errorMessage);
            console.error('Error creating post:', err);
        } finally {
            setLoading(false);
        }
    }, [router, setLoading]);

    return {
        submitPost,
        isLoading,
        error,
        clearError: () => setError(null)
    };
}
