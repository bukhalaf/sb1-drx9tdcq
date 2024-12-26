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
          role: 'admin' | 'company' | 'usher'
          full_name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'admin' | 'company' | 'usher'
          full_name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'company' | 'usher'
          full_name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          creator_id: string
          name: string
          description: string | null
          date: string
          location: string
          required_ushers: number
          price_per_usher: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          name: string
          description?: string | null
          date: string
          location: string
          required_ushers?: number
          price_per_usher: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          name?: string
          description?: string | null
          date?: string
          location?: string
          required_ushers?: number
          price_per_usher?: number
          status?: string
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
          availability: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          specialty: string
          hourly_rate: number
          experience_years?: number
          bio?: string | null
          availability?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          specialty?: string
          hourly_rate?: number
          experience_years?: number
          bio?: string | null
          availability?: boolean
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          usher_id: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          usher_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}