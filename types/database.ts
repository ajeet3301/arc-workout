export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & { id: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string | null;
          frequency: "daily" | "weekly" | "custom";
          target_days: number[] | null;
          archived: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["habits"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["habits"]["Row"]>;
        Relationships: [];
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          user_id: string;
          completed_on: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["habit_logs"]["Row"]> & {
          habit_id: string;
          user_id: string;
          completed_on: string;
        };
        Update: Partial<Database["public"]["Tables"]["habit_logs"]["Row"]>;
        Relationships: [];
      };
      coach_messages: {
        Row: {
          id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["coach_messages"]["Row"]> & {
          user_id: string;
          role: "user" | "assistant";
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["coach_messages"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      habit_streak: {
        Args: { p_habit_id: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitLog = Database["public"]["Tables"]["habit_logs"]["Row"];
export type CoachMessage = Database["public"]["Tables"]["coach_messages"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];