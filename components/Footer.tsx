import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[--color-border] mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[--color-muted]">
        <span>© {new Date().getFullYear()} Terros Digital. All rights reserved.</span>
        <nav className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-[--color-text] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[--color-text] transition-colors">
            Terms of Use
          </Link>
          <Link href="/support" className="hover:text-[--color-text] transition-colors">
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
}
