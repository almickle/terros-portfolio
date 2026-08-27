import type { Metadata } from "next";

/**
 * Everything under /tools, including the login page.
 *
 * Deliberately just metadata. The portal SHELL — sidebar, sign-out — lives one
 * level down in `(portal)/layout.tsx`, because the login page is under /tools
 * too and must not render inside the signed-in chrome: before the split it drew
 * a full navigation sidebar and a "Sign out" button at someone who had not
 * signed in. A route group is what lets one sibling opt out of a layout.
 */
export const metadata: Metadata = {
  title: { default: "Tools", template: "%s | Tools" },
  robots: { index: false, follow: false },
};

export default function ToolsRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
