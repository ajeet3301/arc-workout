"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: "ti-home" },
  { href: "/habits", label: "Habits", icon: "ti-list-check" },
  { href: "/progress", label: "Progress", icon: "ti-chart-bar" },
  { href: "/coach", label: "Coach", icon: "ti-message-circle" },
  { href: "/settings", label: "Settings", icon: "ti-settings" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="glass sticky top-0 z-10 flex items-center justify-between px-6 py-3">
      <Link href="/dashboard" className="text-base font-medium">
        Arc
      </Link>
      <div className="flex items-center gap-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors duration-150",
              pathname.startsWith(link.href) ? "bg-accent/10 text-accent" : "text-secondary hover:bg-surface/5"
            )}
          >
            <i className={clsx("ti", link.icon)} aria-hidden="true" />
            {link.label}
          </Link>
        ))}
      </div>
      <button onClick={handleSignOut} className="text-sm text-secondary hover:text-primary">
        Sign out
      </button>
    </nav>
  );
}
