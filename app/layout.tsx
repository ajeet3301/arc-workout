import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arc — Build habits that stick",
  description: "A calm, custom habit tracker with a lightweight AI coach.",
};

// Applies the saved theme before paint to avoid a light/dark flash.
const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('arc-theme');
    var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.44.0/iconfont/tabler-icons.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
