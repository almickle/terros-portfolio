import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";

const links = [
  { href: "/apps", label: "Apps" },
  { href: "/support", label: "Support" },
];

export function Nav() {
  return (
    <header className="border-b border-[--color-border] bg-[--color-bg]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-[--color-text] hover:text-[--color-brand] transition-colors"
        >
          Terros Digital
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-[--color-muted] hover:text-[--color-text] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm" })}
          >
            Download
          </a>
        </nav>
      </div>
    </header>
  );
}
