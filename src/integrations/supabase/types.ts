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
      Notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          practitioner_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          practitioner_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          practitioner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Notifications_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "Practitioners"
            referencedColumns: ["id"]
          },
        ]
      }
      OnboardingAnswers: {
        Row: {
          answer: Json
          created_at: string
          id: number
          practitioner_id: string
          question_id: number
        }
        Insert: {
          answer: Json
          created_at?: string
          id?: number
          practitioner_id: string
          question_id: number
        }
        Update: {
          answer?: Json
          created_at?: string
          id?: number
          practitioner_id?: string
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "OnboardingAnswers_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "Practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "OnboardingAnswers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "OnboardingQuestions"
            referencedColumns: ["id"]
          },
        ]
      }
      OnboardingQuestions: {
        Row: {
          created_at: string
          id: number
          options: Json | null
          order_index: number
          question_text: string
          question_type: string
        }
        Insert: {
          created_at?: string
          id?: number
          options?: Json | null
          order_index: number
          question_text: string
          question_type: string
        }
        Update: {
          created_at?: string
          id?: number
          options?: Json | null
          order_index?: number
          question_text?: string
          question_type?: string
        }
        Relationships: []
      }
      Practitioners: {
        Row: {
          avatar_url: string | null
          contribution_score: number
          created_at: string
          display_hover_card: boolean
          full_name: string | null
          id: string
          profession_flair: string | null
          role: string
          subscription_tier: string
        }
        Insert: {
          avatar_url?: string | null
          contribution_score?: number
          created_at?: string
          display_hover_card?: boolean
          full_name?: string | null
          id: string
          profession_flair?: string | null
          role?: string
          subscription_tier?: string
        }
        Update: {
          avatar_url?: string | null
          contribution_score?: number
          created_at?: string
          display_hover_card?: boolean
          full_name?: string | null
          id?: string
          profession_flair?: string | null
          role?: string
          subscription_tier?: string
        }
        Relationships: []
      }
      rate_limit_log: {
        Row: {
          created_at: string | null
          id: number
          key: string
          timestamp: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          timestamp: number
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          timestamp?: number
        }
        Relationships: []
      }
      Reviews: {
        Row: {
          access_level: string
          author_id: string | null
          community_post_id: number | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: number
          published_at: string | null
          status: string
          structured_content: Json
          title: string
          view_count: number
        }
        Insert: {
          access_level?: string
          author_id?: string | null
          community_post_id?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: number
          published_at?: string | null
          status?: string
          structured_content?: Json
          title: string
          view_count?: number
        }
        Update: {
          access_level?: string
          author_id?: string | null
          community_post_id?: number | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: number
          published_at?: string | null
          status?: string
          structured_content?: Json
          title?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "Reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "Practitioners"
            referencedColumns: ["id"]
          },
        ]
      }
      ReviewTags: {
        Row: {
          created_at: string
          id: number
          review_id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          review_id: number
          tag_id: number
        }
        Update: {
          created_at?: string
          id?: number
          review_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "ReviewTags_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "Reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ReviewTags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "Tags"
            referencedColumns: ["id"]
          },
        ]
      }
      SiteSettings: {
        Row: {
          created_at: string
          id: number
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: number
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      Suggestion_Votes: {
        Row: {
          created_at: string
          id: string
          practitioner_id: string
          suggestion_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          practitioner_id: string
          suggestion_id: number
        }
        Update: {
          created_at?: string
          id?: string
          practitioner_id?: string
          suggestion_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "Practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Suggestion_Votes_practitioner_id_fkey"
            columns: ["practitioner_id"]
            isOneToOne: false
            referencedRelation: "Practitioners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "Suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Suggestion_Votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "Suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      Suggestions: {
        Row: {
          created_at: string
          description: string | null
          id: number
          status: string
          submitted_by: string | null
          title: string
          upvotes: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          status?: string
          submitted_by?: string | null
          title: string
          upvotes?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          status?: string
          submitted_by?: string | null
          title?: string
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "Suggestions_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "Practitioners"
            referencedColumns: ["id"]
          },
        ]
      }
      Tags: {
        Row: {
          created_at: string
          id: number
          parent_id: number | null
          tag_name: string
        }
        Insert: {
          created_at?: string
          id?: number
          parent_id?: number | null
          tag_name: string
        }
        Update: {
          created_at?: string
          id?: number
          parent_id?: number | null
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "Tags_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "Tags"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_homepage_suggestions: {
        Args: { p_user_id: string }
        Returns: {
          id: number
          title: string
          description: string
          upvotes: number
          created_at: string
          Practitioners: Json
          user_has_voted: boolean
        }[]
      }
      get_my_claim: {
        Args: { claim: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
