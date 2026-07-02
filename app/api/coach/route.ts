import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCoachReply } from "@/lib/ai/groq";

const DAILY_LIMIT = Number(process.env.AI_DAILY_MESSAGE_LIMIT ?? 20);

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const { message } = await request.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  // Enforce the daily cap so one user can't burn the whole free-tier quota.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("coach_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", startOfToday.toISOString());

  if ((count ?? 0) >= DAILY_LIMIT) {
    return NextResponse.json(
      { reply: "You've hit today's coach message limit — come back tomorrow for more." },
      { status: 200 }
    );
  }

  // Pull recent history for context (last 10 messages)
  const { data: history } = await supabase
    .from("coach_messages")
    .select("role, content")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const orderedHistory = (history ?? []).reverse().map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  await supabase.from("coach_messages").insert({ user_id: user.id, role: "user", content: message });

  const reply = await getCoachReply([...orderedHistory, { role: "user", content: message }]);

  await supabase.from("coach_messages").insert({ user_id: user.id, role: "assistant", content: reply });

  return NextResponse.json({ reply });
}
