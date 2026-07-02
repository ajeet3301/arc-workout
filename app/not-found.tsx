import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-secondary">404</p>
      <h1 className="mt-2 text-2xl font-medium">This page doesn't exist</h1>
      <p className="mt-1 text-sm text-secondary">Check the link, or head back to your dashboard.</p>
      <Link href="/dashboard" className="mt-6">
        <Button variant="primary">Go to dashboard</Button>
      </Link>
    </main>
  );
}
