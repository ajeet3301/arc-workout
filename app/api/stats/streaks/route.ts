import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { data: habits } = await supabase
    .from("habits")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("archived", false);

  const streaks = await Promise.all(
    (habits ?? []).map(async (habit) => {
      const { data: streak } = await supabase.rpc("habit_streak", { p_habit_id: habit.id });
      return { habitId: habit.id, name: habit.name, streak: streak ?? 0 };
    })
  );

  return NextResponse.json({ streaks });
}
