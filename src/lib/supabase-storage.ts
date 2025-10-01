/**
 * Utility functions for handling Supabase storage URLs
 */

/**
 * Get the full public URL for a file stored in Supabase storage
 * @param bucketName - The name of the storage bucket
 * @param filePath - The path to the file in the bucket
 * @returns The full public URL or null if invalid
 */
export function getSupabaseStorageUrl(bucketName: string, filePath: string): string | null {
    if (!filePath) return null;

    // If it's already a full URL, return as is
    if (filePath.startsWith('http')) {
        return filePath;
    }

    // Get the Supabase URL from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
        console.error('NEXT_PUBLIC_SUPABASE_URL is not defined');
        return null;
    }

    // Construct the full Supabase storage URL
    return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
}

/**
 * Get the full public URL for a product image
 * @param imagePath - The path to the image file
 * @returns The full public URL or null if invalid
 */
export function getProductImageUrl(imagePath: string): string | null {
    return getSupabaseStorageUrl('product-images', imagePath);
}

/**
 * Get the full public URL for a profile avatar
 * @param avatarPath - The path to the avatar file
 * @returns The full public URL or null if invalid
 */
export function getProfileAvatarUrl(avatarPath: string): string | null {
    return getSupabaseStorageUrl('avatars', avatarPath);
}
