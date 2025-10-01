import { createClient } from '@/integrations/supabase/server';

// Server-side functions for initial data loading
export async function getServerSideSaveData(productId: string, userId?: string) {
    try {
        const supabase = await createClient();

        // Get save count
        const { data: countData, error: countError } = await supabase
            .rpc('get_product_save_count', { product_uuid: productId });

        // Get user's save status if logged in
        let isSaved = false;
        if (userId) {
            const { data: savedData, error: savedError } = await supabase
                .rpc('is_product_saved_by_user', {
                    product_uuid: productId,
                    user_uuid: userId
                });

            if (!savedError) {
                isSaved = savedData || false;
            }
        }

        return {
            saveCount: countData || 0,
            isSaved,
            error: countError?.message || null,
        };
    } catch (error) {
        console.error('Error getting server-side save data:', error);
        return {
            saveCount: 0,
            isSaved: false,
            error: 'Failed to load save data',
        };
    }
}
