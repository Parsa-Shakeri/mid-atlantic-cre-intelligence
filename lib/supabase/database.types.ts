import type { AdminRole, CoveredState, PropertyType, ResearchCategory, VerificationStatus } from "@/lib/types";

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type PropertyInsert = {
  id?: string; slug: string; property_name: string; street_address: string; city: string; state: CoveredState; zip_code: string; county: string;
  latitude?: number | null; longitude?: number | null; property_type: PropertyType; building_sq_ft?: number | null; lot_acres?: number | null;
  year_built?: number | null; year_renovated?: number | null; number_of_floors?: number | null; parking_spaces?: number | null;
  major_tenants?: string[]; description?: string; lease_structure?: string | null; is_sample?: boolean; created_at?: string; updated_at?: string;
};

type TransactionInsert = {
  id?: string; property_id: string; sale_date: string; sale_price: number; buyer?: string | null; seller?: string | null;
  reported_cap_rate?: number | null; reported_noi?: number | null; price_per_sq_ft?: number | null; transaction_type: string;
  notes?: string | null; verification_status?: VerificationStatus; date_verified?: string | null; is_sample?: boolean; created_at?: string; updated_at?: string;
};

type ArticleInsert = {
  id?: string; slug: string; title: string; thesis: string; summary: string; executive_summary?: string[]; body: string;
  category: ResearchCategory; featured_image?: string | null; publication_date?: string | null; status?: "draft" | "published" | "archived";
  featured?: boolean; reading_time?: number; author: string; limitations?: string[]; exhibit?: Json | null; is_sample?: boolean; created_at?: string; updated_at?: string;
};

type SourceInsert = {
  id?: string; transaction_id?: string | null; property_id?: string | null; article_id?: string | null; source_name: string; source_url: string;
  publication_date?: string | null; accessed_date: string; source_type: string; notes?: string | null; is_sample?: boolean; created_at?: string;
};

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string; slug: string; property_name: string; street_address: string; city: string; state: CoveredState; zip_code: string;
          county: string; latitude: number | null; longitude: number | null; property_type: PropertyType; building_sq_ft: number | null;
          lot_acres: number | null; year_built: number | null; year_renovated: number | null; number_of_floors: number | null;
          parking_spaces: number | null; major_tenants: string[]; description: string; lease_structure: string | null;
          is_sample: boolean; created_at: string; updated_at: string;
        };
        Insert: PropertyInsert;
        Update: Partial<PropertyInsert>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string; property_id: string; sale_date: string; sale_price: number; buyer: string | null; seller: string | null;
          reported_cap_rate: number | null; reported_noi: number | null; price_per_sq_ft: number | null; transaction_type: string;
          notes: string | null; verification_status: VerificationStatus; date_verified: string | null; is_sample: boolean;
          created_at: string; updated_at: string;
        };
        Insert: TransactionInsert;
        Update: Partial<TransactionInsert>;
        Relationships: [];
      };
      articles: {
        Row: {
          id: string; slug: string; title: string; thesis: string; summary: string; executive_summary: string[]; body: string;
          category: ResearchCategory; featured_image: string | null; publication_date: string | null; status: "draft" | "published" | "archived";
          featured: boolean; reading_time: number; author: string; limitations: string[]; exhibit: Json | null; is_sample: boolean;
          created_at: string; updated_at: string;
        };
        Insert: ArticleInsert;
        Update: Partial<ArticleInsert>;
        Relationships: [];
      };
      article_properties: {
        Row: { article_id: string; property_id: string };
        Insert: { article_id: string; property_id: string };
        Update: never;
        Relationships: [];
      };
      sources: {
        Row: {
          id: string; transaction_id: string | null; property_id: string | null; article_id: string | null; source_name: string;
          source_url: string; publication_date: string | null; accessed_date: string; source_type: string; notes: string | null;
          is_sample: boolean; created_at: string;
        };
        Insert: SourceInsert;
        Update: Partial<SourceInsert>;
        Relationships: [];
      };
      admin_profiles: {
        Row: { user_id: string; role: AdminRole; display_name: string | null; created_at: string; updated_at: string };
        Insert: { user_id: string; role: AdminRole; display_name?: string | null; created_at?: string; updated_at?: string };
        Update: { role?: AdminRole; display_name?: string | null; updated_at?: string };
        Relationships: [];
      };
      audit_log: {
        Row: { id: number; user_id: string | null; table_name: string; record_id: string; action: "INSERT" | "UPDATE" | "DELETE"; snapshot: Json; changed_at: string };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Views: {
      property_transaction_records: {
        Row: {
          property_id: string | null; transaction_id: string | null; slug: string | null; property_name: string | null; street_address: string | null;
          city: string | null; state: CoveredState | null; zip_code: string | null; county: string | null; property_type: PropertyType | null;
          building_sq_ft: number | null; major_tenants: string[] | null; sale_date: string | null; sale_price: number | null;
          buyer: string | null; seller: string | null; reported_cap_rate: number | null; reported_noi: number | null;
          price_per_sq_ft: number | null; transaction_type: string | null; verification_status: VerificationStatus | null;
          date_verified: string | null; date_added: string | null; is_sample: boolean | null; search_document: string | null;
        };
        Relationships: [];
      };
      public_market_summary: {
        Row: { properties: number | null; transactions: number | null; total_value: number | null; markets: number | null; reports: number | null };
        Relationships: [];
      };
    };
    Functions: {
      get_market_dashboard: {
        Args: {
          filter_date_from?: string | null;
          filter_date_to?: string | null;
          filter_state?: string | null;
          filter_county?: string | null;
          filter_city?: string | null;
          filter_property_type?: string | null;
        };
        Returns: Json;
      };
      is_admin: { Args: { requesting_user?: string }; Returns: boolean };
      is_full_admin: { Args: { requesting_user?: string }; Returns: boolean };
      import_property_transactions: { Args: { import_rows: Json }; Returns: Json };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
