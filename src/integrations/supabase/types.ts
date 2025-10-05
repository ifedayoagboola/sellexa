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
                    kyc_status: string | null
                    business_name: string | null
                    business_description: string | null
                    business_logo_url: string | null
                    business_address: string | null
                    business_city: string | null
                    business_country: string | null
                    business_phone: string | null
                    business_website: string | null
                    business_instagram: string | null
                    business_twitter: string | null
                    business_facebook: string | null
                    kyc_submitted_at: string | null
                    kyc_verified_at: string | null
                    kyc_rejected_at: string | null
                    kyc_rejection_reason: string | null
                }
                Insert: {
                    id: string
                    handle: string
                    name?: string | null
                    city?: string | null
                    postcode?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    kyc_status?: string | null
                    business_name?: string | null
                    business_description?: string | null
                    business_logo_url?: string | null
                    business_address?: string | null
                    business_city?: string | null
                    business_country?: string | null
                    business_phone?: string | null
                    business_website?: string | null
                    business_instagram?: string | null
                    business_twitter?: string | null
                    business_facebook?: string | null
                    kyc_submitted_at?: string | null
                    kyc_verified_at?: string | null
                    kyc_rejected_at?: string | null
                    kyc_rejection_reason?: string | null
                }
                Update: {
                    id?: string
                    handle?: string
                    name?: string | null
                    city?: string | null
                    postcode?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    kyc_status?: string | null
                    business_name?: string | null
                    business_description?: string | null
                    business_logo_url?: string | null
                    business_address?: string | null
                    business_city?: string | null
                    business_country?: string | null
                    business_phone?: string | null
                    business_website?: string | null
                    business_instagram?: string | null
                    business_twitter?: string | null
                    business_facebook?: string | null
                    kyc_submitted_at?: string | null
                    kyc_verified_at?: string | null
                    kyc_rejected_at?: string | null
                    kyc_rejection_reason?: string | null
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
                    status: string
                }
                Insert: {
                    id?: string
                    thread_id: string
                    sender_id: string
                    body: string
                    attachments?: Json | null
                    created_at?: string
                    status?: string
                }
                Update: {
                    id?: string
                    thread_id?: string
                    sender_id?: string
                    body?: string
                    attachments?: Json | null
                    created_at?: string
                    status?: string
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
            message_reactions: {
                Row: {
                    id: string
                    message_id: string
                    user_id: string
                    emoji: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    message_id: string
                    user_id: string
                    emoji: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    message_id?: string
                    user_id?: string
                    emoji?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "message_reactions_message_id_fkey"
                        columns: ["message_id"]
                        isOneToOne: false
                        referencedRelation: "messages"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "message_reactions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            typing_indicators: {
                Row: {
                    id: string
                    thread_id: string
                    user_id: string
                    is_typing: boolean
                    updated_at: string
                }
                Insert: {
                    id?: string
                    thread_id: string
                    user_id: string
                    is_typing?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: string
                    thread_id?: string
                    user_id?: string
                    is_typing?: boolean
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "typing_indicators_thread_id_fkey"
                        columns: ["thread_id"]
                        isOneToOne: false
                        referencedRelation: "threads"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "typing_indicators_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            conversation_metadata: {
                Row: {
                    id: string
                    thread_id: string
                    user_id: string
                    is_archived: boolean
                    is_muted: boolean
                    last_read_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    thread_id: string
                    user_id: string
                    is_archived?: boolean
                    is_muted?: boolean
                    last_read_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    thread_id?: string
                    user_id?: string
                    is_archived?: boolean
                    is_muted?: boolean
                    last_read_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "conversation_metadata_thread_id_fkey"
                        columns: ["thread_id"]
                        isOneToOne: false
                        referencedRelation: "threads"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversation_metadata_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            message_attachments: {
                Row: {
                    id: string
                    message_id: string
                    file_url: string
                    file_name: string
                    file_type: string
                    file_size: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    message_id: string
                    file_url: string
                    file_name: string
                    file_type: string
                    file_size?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    message_id?: string
                    file_url?: string
                    file_name?: string
                    file_type?: string
                    file_size?: number | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "message_attachments_message_id_fkey"
                        columns: ["message_id"]
                        isOneToOne: false
                        referencedRelation: "messages"
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
            get_user_conversations: {
                Args: {
                    user_uuid: string
                }
                Returns: {
                    thread_id: string
                    product_id: string
                    product_title: string
                    product_price_pence: number
                    product_image: string
                    other_user_id: string
                    other_user_name: string
                    other_user_handle: string
                    other_user_avatar_url: string
                    last_message_body: string
                    last_message_created_at: string
                    unread_count: number
                    is_archived: boolean
                    is_muted: boolean
                    last_read_at: string
                }[]
            }
            mark_messages_as_read: {
                Args: {
                    thread_uuid: string
                    user_uuid: string
                }
                Returns: undefined
            }
            get_typing_indicators: {
                Args: {
                    thread_uuid: string
                    user_uuid: string
                }
                Returns: {
                    user_id: string
                    user_name: string
                    user_handle: string
                    is_typing: boolean
                    updated_at: string
                }[]
            }
            set_typing_indicator: {
                Args: {
                    thread_uuid: string
                    user_uuid: string
                    typing: boolean
                }
                Returns: undefined
            }
            get_message_reactions: {
                Args: {
                    message_uuid: string
                }
                Returns: {
                    emoji: string
                    count: number
                    user_reacted: boolean
                }[]
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
