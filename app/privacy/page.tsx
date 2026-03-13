import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Terros Digital apps.",
};

const EFFECTIVE_DATE = "March 13, 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-[--color-muted]">Effective: {EFFECTIVE_DATE}</p>
      </div>

      <Separator className="mb-10" />

      <div className="space-y-10 text-sm leading-relaxed text-[--color-muted]">
        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">1. Overview</h2>
          <p>
            Terros Digital (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the Menzi iOS application. This Privacy
            Policy explains what data we collect, why we collect it, and how we
            handle it. We are committed to collecting only what is necessary to
            deliver and improve our services.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">2. Data We Collect</h2>
          <p className="mb-3">
            <strong className="text-[--color-text]">Account data.</strong> When you create an account we collect your email
            address and a hashed password.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">Learning data.</strong> We store your vocabulary deck, flashcard review
            history, SM-2 scheduling parameters, and Constructs progress so that
            your learning state persists across devices and app updates.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">Usage data.</strong> We collect anonymized usage events (e.g., sessions
            started, modes used) to understand how the app is being used and to
            improve it.
          </p>
          <p>
            <strong className="text-[--color-text]">Voice data.</strong> Speaking Mode audio is processed in real time by
            ElevenLabs and is not stored by Terros Digital. Please refer to
            ElevenLabs&apos; privacy policy for their data practices.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide and personalize the app experience</li>
            <li>To calculate your spaced repetition schedule</li>
            <li>To generate AI-powered feedback and content tailored to your vocabulary</li>
            <li>To manage your subscription and process payments via the App Store</li>
            <li>To respond to support requests</li>
            <li>To analyze usage patterns and improve the app</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">4. Third-Party Services</h2>
          <p className="mb-3">We use the following third-party services to operate the app:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[--color-text]">ElevenLabs</strong> — real-time voice generation for Speaking and Listening modes
            </li>
            <li>
              <strong className="text-[--color-text]">LLM API provider</strong> — flashcard grading, feedback, and content generation
            </li>
            <li>
              <strong className="text-[--color-text]">Apple App Store</strong> — subscription billing and payment processing
            </li>
          </ul>
          <p className="mt-3">
            We do not sell your personal data to third parties and do not use your data for advertising purposes.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">5. Data Retention</h2>
          <p>
            We retain your account and learning data for as long as your account
            is active. You may request deletion of your account and all
            associated data at any time by emailing us (see Section 8). We will
            action deletion requests within 30 days.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">6. Children&apos;s Privacy</h2>
          <p>
            Menzi is not directed at children under 13. We do not knowingly
            collect personal data from children under 13. If you believe a child
            has provided us with personal data, please contact us and we will
            delete it promptly.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">7. Security</h2>
          <p>
            We use industry-standard security practices including encryption in
            transit (TLS) and at rest. No method of transmission or storage is
            100% secure; if you discover a security issue please disclose it
            responsibly by emailing us directly.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">8. Contact</h2>
          <p className="mb-2">Questions about this policy or requests regarding your data:</p>
          <a
            href="mailto:privacy@terrosdigital.com"
            className="text-[--color-brand] hover:text-[--color-brand-hover] transition-colors"
          >
            privacy@terrosdigital.com
          </a>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">9. Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will
            be communicated via an in-app notice or email. Continued use of the
            app after a policy update constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>
    </div>
  );
}
