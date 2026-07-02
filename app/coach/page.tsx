"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

type Message = { role: "user" | "assistant"; content: string };

export default function CoachPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadHistory() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("coach_messages")
        .select("role, content")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(30);
      if (data) setMessages(data as Message[]);
    }
    loadHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);

    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage.content }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    setSending(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
        <h1 className="text-2xl font-medium">Coach</h1>
        <p className="mt-1 text-sm text-secondary">Ask about habits, motivation, or general fitness questions.</p>

        <div className="mt-6 flex-1 space-y-3 overflow-y-auto">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "ml-auto bg-accent text-accent-fg" : "card"
                }`}
              >
                {m.content}
              </motion.div>
            ))}
          </AnimatePresence>
          {sending && <div className="card w-fit px-4 py-2.5 text-sm text-secondary">Thinking…</div>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach anything…"
            className="flex-1 rounded-xl border border-border/20 bg-transparent px-4 py-2.5 text-sm outline-none focus-visible:border-accent"
          />
          <Button type="submit" variant="primary" disabled={sending}>
            Send
          </Button>
        </form>
      </main>
    </div>
  );
}
