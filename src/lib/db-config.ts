// Database configuration for different environments

export interface DatabaseConfig {
    url: string;
    serviceKey: string;
    anonKey: string;
    environment: 'development' | 'production' | 'test';
}

export function getDatabaseConfig(): DatabaseConfig {
    const environment = process.env.NODE_ENV || 'development';

    // Development configuration
    if (environment === 'development') {
        return {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.DATABASE_URL_DEV || '',
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            environment: 'development'
        };
    }

    // Production configuration
    if (environment === 'production') {
        return {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.DATABASE_URL_PROD || '',
            serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
            anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            environment: 'production'
        };
    }

    // Test configuration
    return {
        url: process.env.DATABASE_URL_TEST || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        environment: 'test'
    };
}

export function validateDatabaseConfig(config: DatabaseConfig): boolean {
    if (!config.url) {
        console.error('❌ Missing database URL');
        return false;
    }

    if (!config.serviceKey) {
        console.error('❌ Missing service role key');
        return false;
    }

    if (!config.anonKey) {
        console.error('❌ Missing anon key');
        return false;
    }

    return true;
}

