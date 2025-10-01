export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    handle: string
                    name: string | null
                    city: string | null
                    postcode: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    handle: string
                    name?: string | null
                    city?: string | null
                    postcode?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    handle?: string
                    name?: string | null
                    city?: string | null
                    postcode?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            products: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    price_pence: number
                    currency: string
                    status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD'
                    category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER'
                    images: string[]
                    city: string | null
                    postcode: string | null
                    tags: string[]
                    search_vector: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    price_pence: number
                    currency?: string
                    status?: 'AVAILABLE' | 'RESTOCKING' | 'SOLD'
                    category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER'
                    images?: string[]
                    city?: string | null
                    postcode?: string | null
                    tags?: string[]
                    search_vector?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    price_pence?: number
                    currency?: string
                    status?: 'AVAILABLE' | 'RESTOCKING' | 'SOLD'
                    category?: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER'
                    images?: string[]
                    city?: string | null
                    postcode?: string | null
                    tags?: string[]
                    search_vector?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            saves: {
                Row: {
                    user_id: string
                    product_id: string
                    created_at: string
                }
                Insert: {
                    user_id: string
                    product_id: string
                    created_at?: string
                }
                Update: {
                    user_id?: string
                    product_id?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "saves_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "saves_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            threads: {
                Row: {
                    id: string
                    buyer_id: string
                    seller_id: string
                    product_id: string
                    created_at: string
                    last_message_at: string | null
                }
                Insert: {
                    id?: string
                    buyer_id: string
                    seller_id: string
                    product_id: string
                    created_at?: string
                    last_message_at?: string | null
                }
                Update: {
                    id?: string
                    buyer_id?: string
                    seller_id?: string
                    product_id?: string
                    created_at?: string
                    last_message_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "threads_buyer_id_fkey"
                        columns: ["buyer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "threads_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "threads_seller_id_fkey"
                        columns: ["seller_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            messages: {
                Row: {
                    id: string
                    thread_id: string
                    sender_id: string
                    body: string
                    attachments: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    thread_id: string
                    sender_id: string
                    body: string
                    attachments?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    thread_id?: string
                    sender_id?: string
                    body?: string
                    attachments?: Json | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_thread_id_fkey"
                        columns: ["thread_id"]
                        isOneToOne: false
                        referencedRelation: "threads"
                        referencedColumns: ["id"]
                    }
                ]
            }
            reports: {
                Row: {
                    id: string
                    reporter_id: string
                    product_id: string
                    reason: 'COUNTERFEIT' | 'ILLEGAL' | 'SCAM' | 'HATE' | 'OTHER'
                    notes: string | null
                    created_at: string
                    status: string
                }
                Insert: {
                    id?: string
                    reporter_id: string
                    product_id: string
                    reason: 'COUNTERFEIT' | 'ILLEGAL' | 'SCAM' | 'HATE' | 'OTHER'
                    notes?: string | null
                    created_at?: string
                    status?: string
                }
                Update: {
                    id?: string
                    reporter_id?: string
                    product_id?: string
                    reason?: 'COUNTERFEIT' | 'ILLEGAL' | 'SCAM' | 'HATE' | 'OTHER'
                    notes?: string | null
                    created_at?: string
                    status?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "reports_product_id_fkey"
                        columns: ["product_id"]
                        isOneToOne: false
                        referencedRelation: "products"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "reports_reporter_id_fkey"
                        columns: ["reporter_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_product_save_count: {
                Args: {
                    product_uuid: string
                }
                Returns: number
            }
            is_product_saved_by_user: {
                Args: {
                    product_uuid: string
                    user_uuid: string
                }
                Returns: boolean
            }
        }
        Enums: {
            product_status: 'AVAILABLE' | 'RESTOCKING' | 'SOLD'
            product_category: 'FOOD' | 'FASHION' | 'HAIR' | 'HOME' | 'CULTURE' | 'OTHER'
            report_reason: 'COUNTERFEIT' | 'ILLEGAL' | 'SCAM' | 'HATE' | 'OTHER'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
