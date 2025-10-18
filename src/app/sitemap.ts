import { createClient } from '@/integrations/supabase/server';

export default async function sitemap() {
    const supabase = await createClient();

    // Get all products
    const { data: products } = await supabase
        .from('products')
        .select('id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1000); // Limit to prevent too large sitemap

    // Static pages
    const staticPages = [
        {
            url: '/',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: '/about',
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        },
        {
            url: '/feed',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: '/search',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: '/post',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        },
        {
            url: '/inbox',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        },
        {
            url: '/profile',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.7,
        },
        {
            url: '/notifications',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.6,
        },
    ];

    // Category pages
    const categories = ['food', 'fashion', 'hair', 'home', 'culture', 'other'];
    const categoryPages = categories.map((category) => ({
        url: `/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Product pages
    const productPages = products?.map((product) => ({
        url: `/product/${product.id}`,
        lastModified: new Date(product.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    })) || [];

    return [...staticPages, ...categoryPages, ...productPages];
}
