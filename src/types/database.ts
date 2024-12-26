export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'company' | 'usher'
          full_name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'admin' | 'company' | 'usher'
          full_name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'company' | 'usher'
          full_name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          company_id: string
          title: string
          description: string | null
          date: string
          location: string
          required_ushers: number
          price_per_usher: number
          status: 'draft' | 'published' | 'cancelled' | 'completed'
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          title: string
          description?: string | null
          date: string
          location: string
          required_ushers?: number
          price_per_usher: number
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          title?: string
          description?: string | null
          date?: string
          location?: string
          required_ushers?: number
          price_per_usher?: number
          status?: 'draft' | 'published' | 'cancelled' | 'completed'
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      usher_profiles: {
        Row: {
          id: string
          specialty: string
          hourly_rate: number
          experience_years: number
          bio: string | null
          available: boolean
          featured: boolean
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          specialty: string
          hourly_rate: number
          experience_years?: number
          bio?: string | null
          available?: boolean
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          specialty?: string
          hourly_rate?: number
          experience_years?: number
          bio?: string | null
          available?: boolean
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      event_applications: {
        Row: {
          id: string
          event_id: string
          usher_id: string
          status: 'pending' | 'approved' | 'rejected'
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          usher_id: string
          status?: 'pending' | 'approved' | 'rejected'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          usher_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_stats: {
        Row: {
          event_id: string
          views: number
          applications: number
          updated_at: string
        }
        Insert: {
          event_id: string
          views?: number
          applications?: number
          updated_at?: string
        }
        Update: {
          event_id?: string
          views?: number
          applications?: number
          updated_at?: string
        }
      }
    }
  }
}