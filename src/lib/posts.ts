import { supabase } from '@/integrations/supabase/client';

export interface CreatePostData {
    title: string;
    description?: string;
    price_pence: number;
    currency?: string;
    status?: 'AVAILABLE' | 'RESTOCKING' | 'SOLD';
    category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER';
    images: string[];
    city?: string;
    postcode?: string;
    tags?: string[];
}

export interface CreatePostResult {
    success: boolean;
    productId?: string;
    error?: string;
}

// Upload images to Supabase storage
export async function uploadImages(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        const uploadPromises = files.map(async (file) => {
            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                throw error;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            return publicUrl;
        });

        const urls = await Promise.all(uploadPromises);
        return { success: true, urls };
    } catch (error) {
        console.error('Error uploading images:', error);
        return {
            success: false,
            error: 'Failed to upload images'
        };
    }
}

// Create a new product post
export async function createPost(postData: CreatePostData): Promise<CreatePostResult> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'User not authenticated' };
        }

        // Validate required fields
        if (!postData.title.trim()) {
            return { success: false, error: 'Title is required' };
        }
        if (postData.price_pence <= 0) {
            return { success: false, error: 'Price must be greater than 0' };
        }
        if (postData.images.length === 0) {
            return { success: false, error: 'At least one image is required' };
        }

        // Prepare data for insertion
        const insertData = {
            user_id: user.id,
            title: postData.title.trim(),
            description: postData.description?.trim() || null,
            price_pence: postData.price_pence,
            currency: postData.currency || 'GBP',
            status: postData.status || 'AVAILABLE',
            category: postData.category,
            images: postData.images,
            city: postData.city?.trim() || null,
            postcode: postData.postcode?.trim() || null,
            tags: postData.tags || [],
            search_vector: null // Will be updated by database trigger
        };

        const { data, error } = await supabase
            .from('products')
            .insert(insertData)
            .select('id')
            .single();

        if (error) {
            console.error('Error creating post:', error);
            return { success: false, error: 'Failed to create post' };
        }

        return {
            success: true,
            productId: data.id
        };
    } catch (error) {
        console.error('Error creating post:', error);
        return {
            success: false,
            error: 'Failed to create post'
        };
    }
}

// Parse tags from string input
export function parseTags(tagString: string): string[] {
    return tagString
        .split(/[,\s]+/)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => tag.startsWith('#') ? tag : `#${tag}`);
}

// Convert price from pounds to pence
export function poundsToPence(pounds: number): number {
    return Math.round(pounds * 100);
}

// Convert price from pence to pounds
export function penceToPounds(pence: number): number {
    return pence / 100;
}
