export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          is_admin: boolean;
          is_suspended: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name: string;
          is_admin?: boolean;
          is_suspended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          is_admin?: boolean;
          is_suspended?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      trees: {
        Row: {
          id: string;
          user_id: string;
          tree_name: string;
          theme: string;
          settings: Json;
          is_public: boolean;
          accept_messages: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tree_name: string;
          theme?: string;
          settings?: Json;
          is_public?: boolean;
          accept_messages?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tree_name?: string;
          theme?: string;
          settings?: Json;
          is_public?: boolean;
          accept_messages?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      ornaments: {
        Row: {
          id: string;
          tree_id: string;
          ornament_type: string;
          position_x: number;
          position_y: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          ornament_type: string;
          position_x: number;
          position_y: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          ornament_type?: string;
          position_x?: number;
          position_y?: number;
          created_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          tree_id: string;
          ornament_id: string;
          sender_name: string;
          message_content: string;
          is_anonymous: boolean;
          is_hidden: boolean;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          ornament_id: string;
          sender_name: string;
          message_content: string;
          is_anonymous?: boolean;
          is_hidden?: boolean;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          ornament_id?: string;
          sender_name?: string;
          message_content?: string;
          is_anonymous?: boolean;
          is_hidden?: boolean;
          ip_hash?: string | null;
          created_at?: string;
        };
      };
      tree_visits: {
        Row: {
          id: string;
          tree_id: string;
          visit_date: string;
          visit_count: number;
        };
        Insert: {
          id?: string;
          tree_id: string;
          visit_date?: string;
          visit_count?: number;
        };
        Update: {
          id?: string;
          tree_id?: string;
          visit_date?: string;
          visit_count?: number;
        };
      };
      app_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: string;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: string;
          description?: string | null;
          updated_at?: string;
        };
      };
      admin_logs: {
        Row: {
          id: string;
          admin_id: string | null;
          action: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id?: string | null;
          action: string;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string | null;
          action?: string;
          details?: Json;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          tree_id: string;
          message_id: string;
          reason: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tree_id: string;
          message_id: string;
          reason: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tree_id?: string;
          message_id?: string;
          reason?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Tree = Database['public']['Tables']['trees']['Row'];
export type Ornament = Database['public']['Tables']['ornaments']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type TreeVisit = Database['public']['Tables']['tree_visits']['Row'];
export type AppSetting = Database['public']['Tables']['app_settings']['Row'];
export type AdminLog = Database['public']['Tables']['admin_logs']['Row'];
export type Report = Database['public']['Tables']['reports']['Row'];

export type OrnamentType =
  | 'gold_ball'
  | 'silver_ball'
  | 'red_ball'
  | 'star'
  | 'snowflake'
  | 'bell'
  | 'gift_box'
  | 'heart';

export type TreeTheme = 'classic' | 'snowy' | 'golden' | 'midnight';
