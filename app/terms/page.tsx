import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of Use for Terros Digital apps.",
};

const EFFECTIVE_DATE = "March 13, 2026";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
        <p className="text-sm text-[--color-muted]">Effective: {EFFECTIVE_DATE}</p>
      </div>

      <Separator className="mb-10" />

      <div className="space-y-10 text-sm leading-relaxed text-[--color-muted]">
        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">1. Acceptance</h2>
          <p>
            By downloading or using Menzi or any other Terros Digital application,
            you agree to these Terms of Use. If you do not agree, do not use our apps.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">2. License</h2>
          <p>
            We grant you a personal, non-exclusive, non-transferable, revocable
            license to use Menzi on devices you own or control, subject to these
            terms and Apple&apos;s App Store terms of service. You may not copy,
            modify, distribute, sell, or reverse engineer any part of the app.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">3. Subscriptions and Billing</h2>
          <p className="mb-3">
            Menzi offers auto-renewing subscription tiers (Standard, Pro) billed
            through Apple&apos;s In-App Purchase system. Prices are shown in the app before purchase.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Subscriptions renew automatically unless cancelled at least 24 hours before the end of the current period.</li>
            <li>Manage or cancel your subscription in iPhone Settings → Apple ID → Subscriptions.</li>
            <li>Refunds are handled by Apple in accordance with their policies.</li>
            <li>We reserve the right to change subscription pricing with reasonable notice.</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">4. Acceptable Use</h2>
          <p className="mb-3">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the app for any unlawful purpose</li>
            <li>Attempt to circumvent subscription or access controls</li>
            <li>Abuse AI-generated content in ways that violate third-party provider policies</li>
            <li>Scrape, reproduce, or redistribute app content without permission</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">5. AI-Generated Content</h2>
          <p>
            Menzi uses large language models and voice synthesis to generate
            educational content. This content is for learning purposes only and
            may occasionally contain errors. We do not guarantee the accuracy of
            AI-generated explanations, feedback, or sentences. Always verify
            important language information with authoritative sources.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">6. Intellectual Property</h2>
          <p>
            All app code, design, branding, and original content is the property
            of Terros Digital. User-generated content (vocabulary additions, notes)
            remains yours; you grant us a license to store and process it to provide the service.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">7. Disclaimer of Warranties</h2>
          <p>
            The app is provided &quot;as is&quot; without warranties of any kind. We do not
            warrant that the app will be uninterrupted, error-free, or that
            specific learning outcomes will be achieved. Use at your own risk.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Terros Digital shall not be
            liable for any indirect, incidental, special, or consequential damages
            arising from your use of the app. Our total liability shall not exceed
            the amount you paid us in the 12 months preceding the claim.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">9. Termination</h2>
          <p>
            We may suspend or terminate your access if you violate these terms.
            You may stop using the app at any time. Sections 6, 7, and 8 survive termination.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">10. Governing Law</h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which
            Terros Digital is registered, without regard to conflict of law principles.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">11. Contact</h2>
          <p className="mb-2">Questions about these terms:</p>
          <a
            href="mailto:legal@terrosdigital.com"
            className="text-[--color-brand] hover:text-[--color-brand-hover] transition-colors"
          >
            legal@terrosdigital.com
          </a>
        </section>
      </div>
    </div>
  );
}
