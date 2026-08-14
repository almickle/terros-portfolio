import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Terros Digital apps.",
};

const EFFECTIVE_DATE = "August 11, 2026";

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
          <p className="mb-3">
            Terros Digital LLC (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the Menzi iOS
            application. This policy explains what we collect, why, who we share it with, how long
            we keep it, and how you can get it deleted.
          </p>
          <p>
            The short version: everything we collect is tied to your account and used to run the
            app. We do not sell your data, we do not use it for advertising, we do not track you
            across other companies&apos; apps or websites, and there is no advertising or analytics
            SDK in Menzi.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">2. Data We Collect</h2>
          <p className="mb-3">
            These are the same categories we declare on Menzi&apos;s App Store privacy label. All of
            them are linked to your account.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[--color-text]">Contact info</strong> — your name and email
              address, collected when you create an account.
            </li>
            <li>
              <strong className="text-[--color-text]">Content you create</strong> — the sentences
              you write, your chat messages, words you add, and the stories Menzi generates for you.
              Audio you import to study as a story is not in this list: it stays on your device and
              never reaches our database.
            </li>
            <li>
              <strong className="text-[--color-text]">Audio</strong> — recordings you make when you
              hold the microphone to speak or to complete a pronunciation review.
            </li>
            <li>
              <strong className="text-[--color-text]">Learning data</strong> — your vocabulary deck,
              review history, grades, spaced-repetition schedule, grammar-pattern progress and
              listening time.
            </li>
            <li>
              <strong className="text-[--color-text]">Identifiers</strong> — your account ID, and a
              device identifier we generate ourselves to remember that a device has completed
              placement and to deliver push notifications. This is not Apple&apos;s advertising
              identifier; Menzi never requests it.
            </li>
            <li>
              <strong className="text-[--color-text]">Purchases</strong> — your subscription status
              and its history. We never see your card details; Apple handles payment.
            </li>
            <li>
              <strong className="text-[--color-text]">Usage data</strong> — which screens you open,
              which days you are active, and whether you started or completed a purchase.
            </li>
            <li>
              <strong className="text-[--color-text]">Diagnostics</strong> — crash reports,
              performance traces, and a breadcrumb log of what the app did before a fault. Crash
              reports may include a screenshot of the screen you were on at the moment of the crash.
            </li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To authenticate you and keep your learning state across devices</li>
            <li>To grade the sentences you write and the words you say</li>
            <li>To calculate your spaced-repetition schedule across all four skills</li>
            <li>To generate practice content from the vocabulary you already know</li>
            <li>To manage your subscription and enforce usage limits</li>
            <li>To diagnose crashes and faults, and to measure whether features work</li>
            <li>To respond to support requests</li>
          </ul>
          <p className="mt-3">
            We do not use your data for advertising, and we do not share it with data brokers.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">4. AI Processing</h2>
          <p className="mb-3">
            Menzi&apos;s core feature is that a language model reads what you produce and grades it.
            That means the text and audio below leave your device and are processed by third-party
            AI services:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[--color-text]">The sentences and chat messages you write</strong>{" "}
              are sent to <strong className="text-[--color-text]">OpenRouter</strong>, which routes
              them to a large language model to be graded, answered, or used to generate a story or
              exercise. Depending on the task, the model may be operated by Google or
              OpenAI. The in-app AI consent screen names the same list, derived from the models
              actually in use, and is the version to trust if this page ever falls behind it.
            </li>
            <li>
              <strong className="text-[--color-text]">Audio you record</strong> is sent to{" "}
              <strong className="text-[--color-text]">ElevenLabs</strong> to be transcribed, and to{" "}
              <strong className="text-[--color-text]">Microsoft Azure</strong> to be scored for
              pronunciation and tone.
            </li>
            <li>
              <strong className="text-[--color-text]">Text we generate for you</strong> — tutor
              replies, sentences, stories — is sent to{" "}
              <strong className="text-[--color-text]">ElevenLabs</strong> to be spoken aloud.
            </li>
          </ul>
          <p className="mt-3">
            We do not store your recordings. Audio is passed through for transcription and scoring;
            what we keep is the resulting transcript and score.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">5. Third-Party Services</h2>
          <p className="mb-3">
            We share data with the following processors, only as needed to run Menzi. Each is bound
            by its own agreement to protect your data to a standard equal to this policy, and none
            of them is permitted to use it for their own advertising.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-[--color-text]">OpenRouter</strong> — routes text to language models for grading and generation</li>
            <li><strong className="text-[--color-text]">ElevenLabs</strong> — speech synthesis and transcription</li>
            <li><strong className="text-[--color-text]">Microsoft Azure</strong> — pronunciation and tone scoring</li>
            <li><strong className="text-[--color-text]">RevenueCat</strong> — subscription status, over Apple In-App Purchase</li>
            <li><strong className="text-[--color-text]">Apple</strong> — payment processing and push notification delivery</li>
            <li><strong className="text-[--color-text]">Sentry</strong> — crash and performance diagnostics</li>
            <li><strong className="text-[--color-text]">Resend</strong> — password-reset email</li>
            <li><strong className="text-[--color-text]">Neon</strong> — database hosting</li>
            <li><strong className="text-[--color-text]">Railway</strong> — application hosting</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal data, and we do not share it for advertising or advertising
            measurement.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">6. Data Retention</h2>
          <p className="mb-3">
            We keep your account and learning data for as long as your account exists. Diagnostic
            breadcrumbs are kept on a short rolling window and then discarded. Audio recordings are
            not retained at all.
          </p>
          <p className="mb-3">
            Audio you import to study as a story is stored only on your device. It is sent once for
            transcription and not retained there either; the transcript is matched against the
            dictionary on our servers, and all we keep from it is which words you encountered and
            how often. We do not store the audio or the transcript.
          </p>
          <p>
            Guest accounts created during onboarding but never completed are pruned automatically.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">7. Your Choices and Rights</h2>
          <p className="mb-3">
            <strong className="text-[--color-text]">Deleting your account.</strong> You can delete
            your account and everything associated with it from inside the app: Settings, then
            Delete Account at the bottom of the screen. This is immediate and permanent — it removes
            your deck, review history, sessions, stories and subscription record. You can also email
            us and we will action it within 30 days.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">Withdrawing consent.</strong> Menzi cannot grade
            your writing or score your speech without sending them to the services listed in Section
            4, so withdrawing consent to that processing means discontinuing use of the app —
            deleting your account is how you do that. You can turn off notifications at any time in
            Settings or in iOS Settings, and you can decline the microphone permission and continue
            using every written mode.
          </p>
          <p>
            <strong className="text-[--color-text]">Access and correction.</strong> Email us to
            request a copy of your data or to correct it. Depending on where you live you may have
            additional rights under the GDPR or the CCPA, including the right to object to
            processing; contact us and we will honour them.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">8. International Transfers</h2>
          <p>
            Terros Digital LLC is based in the United States, and the services listed in Section 5
            process data in the United States and other countries. If you use Menzi from outside the
            US, your data will be transferred to and processed there.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">9. Children&apos;s Privacy</h2>
          <p>
            Menzi is not directed at children under 13. We do not knowingly collect personal data
            from children under 13. If you believe a child has provided us with personal data,
            please contact us and we will delete it promptly.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">10. Security</h2>
          <p>
            We use industry-standard security practices including encryption in transit (TLS) and at
            rest. Passwords are stored hashed and are never readable by us. No method of transmission
            or storage is 100% secure; if you discover a security issue please disclose it
            responsibly by emailing us directly.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">11. Contact</h2>
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
          <h2 className="text-base font-semibold text-[--color-text] mb-3">12. Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be communicated via
            an in-app notice or email. Continued use of the app after a policy update constitutes
            acceptance of the revised policy.
          </p>
        </section>
      </div>
    </div>
  );
}
