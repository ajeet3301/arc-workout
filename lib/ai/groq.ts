const COACH_SYSTEM_PROMPT = `You are Arc's coach: warm, brief, and practical. You help with habit consistency, gentle motivation, and general fitness/wellness questions.

Rules:
- Keep replies short — 2-4 sentences unless the person asks for detail.
- Never give medical diagnoses or specific medication/dosage advice; suggest a doctor for anything medical.
- Be encouraging without being saccharine. No exclamation-point spam.
- If asked about something outside habits/fitness/wellness, gently redirect.`;

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

async function callGroq(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: COACH_SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [{ role: "system", content: COACH_SYSTEM_PROMPT }, ...messages],
      max_tokens: 300,
    }),
  });

  if (!res.ok) throw new Error(`OpenRouter error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

/**
 * Tries Groq first (fastest free tier), falls back to OpenRouter's free
 * model if Groq is rate-limited or unavailable.
 */
export async function getCoachReply(messages: ChatMessage[]): Promise<string> {
  try {
    return await callGroq(messages);
  } catch {
    try {
      return await callOpenRouter(messages);
    } catch {
      return "The coach is a little overloaded right now — try again in a moment.";
    }
  }
}
