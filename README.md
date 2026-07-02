# Arc

A calm, custom habit tracker with a free-tier AI coach. Next.js 14 + TypeScript + Tailwind + Supabase.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com), then:
   - Go to SQL Editor → paste and run `supabase/schema.sql`
   - Go to Authentication → Providers → enable **Google** (add your OAuth client ID/secret) and **Email**
   - Go to Project Settings → API → copy your URL and anon key

3. **Get free AI API keys**
   - Groq: [console.groq.com/keys](https://console.groq.com/keys)
   - OpenRouter (fallback): [openrouter.ai/keys](https://openrouter.ai/keys)

4. **Set environment variables**
   ```bash
   cp .env.example .env.local
   # fill in the values
   ```

5. **Run locally**
   ```bash
   npm run dev
   ```

6. **Deploy** — push to GitHub, import into [Vercel](https://vercel.com), add the same environment variables in the Vercel project settings.

## Structure

- `app/` — pages and API routes (Next.js App Router)
- `components/` — reusable UI (Button, Card, HabitRow, Navbar)
- `lib/supabase/` — browser and server Supabase clients
- `lib/ai/groq.ts` — AI coach model calls (Groq primary, OpenRouter fallback)
- `supabase/schema.sql` — full database schema, RLS policies, and streak calculation function
- `middleware.ts` — protects `/dashboard`, `/habits`, `/progress`, `/coach`, `/settings` behind auth

## MVP scope (see product discussion for full context)

Custom habit tracking with streaks + a usage-capped AI coach chat. Deferred to later phases: workout library, AI diet planner, meal photo scanning, community, challenges, gamification, admin panel.
# arc-workout
