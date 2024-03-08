import { InferSelectModel } from "drizzle-orm";
import { orders, categories, products } from "../../../migrations/schema";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          category_name: string;
          created_at: string | null;
          icon_id: string;
          id: string;
          no_of_products: number;
        };
        Insert: {
          category_name: string;
          created_at?: string | null;
          icon_id: string;
          id?: string;
          no_of_products: number;
        };
        Update: {
          category_name?: string;
          created_at?: string | null;
          icon_id?: string;
          id?: string;
          no_of_products?: number;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          created_at: string | null;
          customer_id: string;
          id: string;
          items: Json | null;
          order_status: string;
          total_price: number;
        };
        Insert: {
          created_at?: string | null;
          customer_id: string;
          id?: string;
          items?: Json | null;
          order_status: string;
          total_price: number;
        };
        Update: {
          created_at?: string | null;
          customer_id?: string;
          id?: string;
          items?: Json | null;
          order_status?: string;
          total_price?: number;
        };
        Relationships: [];
      };
      products: {
        Row: {
          additional_info: string | null;
          category_name: string;
          created_at: string | null;
          description: string | null;
          feedbacks: string[] | null;
          id: string;
          image: string;
          price: string;
          product_name: string;
          quantiy: string | null;
          rating: number;
          stock: number;
          tags: string[];
          updated_at: string | null;
        };
        Insert: {
          additional_info?: string | null;
          category_name: string;
          created_at?: string | null;
          description?: string | null;
          feedbacks?: string[] | null;
          id?: string;
          image: string;
          price: string;
          product_name: string;
          quantiy?: string | null;
          rating: number;
          stock: number;
          tags: string[];
          updated_at?: string | null;
        };
        Update: {
          additional_info?: string | null;
          category_name?: string;
          created_at?: string | null;
          description?: string | null;
          feedbacks?: string[] | null;
          id?: string;
          image?: string;
          price?: string;
          product_name?: string;
          quantiy?: string | null;
          rating?: number;
          stock?: number;
          tags?: string[];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          billing_details: Json | null;
          created_at: string | null;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
        };
        Insert: {
          billing_details?: Json | null;
          created_at?: string | null;
          email: string;
          first_name: string;
          id?: string;
          last_name: string;
          phone: string;
        };
        Update: {
          billing_details?: Json | null;
          created_at?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string;
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
};

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never;

export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type Order = InferSelectModel<typeof orders>;
