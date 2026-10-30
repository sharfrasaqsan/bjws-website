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
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string;
          message: string;
          locale: string;
          status: "new" | "read" | "archived" | "replied";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email?: string | null;
          phone: string;
          message: string;
          locale?: string;
          status?: "new" | "read" | "archived" | "replied";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          phone?: string;
          message?: string;
          locale?: string;
          status?: "new" | "read" | "archived" | "replied";
          created_at?: string;
        };
        Relationships: [];
      };
      membership_requests: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          email: string | null;
          address_area: string;
          family_size: number | null;
          preferred_contact: "phone" | "whatsapp" | "sms" | "email";
          plan: "monthly" | "annual";
          consent: boolean;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          email?: string | null;
          address_area: string;
          family_size?: number | null;
          preferred_contact?: "phone" | "whatsapp" | "sms" | "email";
          plan?: "monthly" | "annual";
          consent: boolean;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string;
          email?: string | null;
          address_area?: string;
          family_size?: number | null;
          preferred_contact?: "phone" | "whatsapp" | "sms" | "email";
          plan?: "monthly" | "annual";
          consent?: boolean;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Relationships: [];
      };
      notices: {
        Row: {
          id: string;
          title: string;
          body: string;
          locale: string;
          published_at: string;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          locale?: string;
          published_at?: string;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          locale?: string;
          published_at?: string;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          title: string;
          year: number;
          file_path: string;
          file_size: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          year: number;
          file_path: string;
          file_size?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          year?: number;
          file_path?: string;
          file_size?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
