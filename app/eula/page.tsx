import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "End User License Agreement",
  description: "End User License Agreement for Menzi, by Terros Digital LLC.",
};

const EFFECTIVE_DATE = "August 11, 2026";

export default function EulaPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-12">
        <Badge variant="outline" className="mb-4">Legal</Badge>
        <h1 className="text-4xl font-bold mb-2">End User License Agreement</h1>
        <p className="text-sm text-[--color-muted]">Effective: {EFFECTIVE_DATE}</p>
      </div>

      <Separator className="mb-10" />

      <div className="space-y-10 text-sm leading-relaxed text-[--color-muted]">
        <section>
          <p>
            This End User License Agreement (the &quot;Agreement&quot;) governs your use of Menzi
            (the &quot;Application&quot;), provided by Terros Digital LLC (&quot;we&quot;,
            &quot;our&quot;, &quot;us&quot;). By downloading or using the Application you agree to
            these terms. If you do not agree, do not use the Application.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">1. Acknowledgement</h2>
          <p>
            This Agreement is concluded between you and Terros Digital LLC only, and not with Apple
            Inc. We, not Apple, are solely responsible for the Application and its content. This
            Agreement does not provide usage rules for the Application that conflict with the Apple
            Media Services Terms and Conditions.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">2. Scope of License</h2>
          <p>
            We grant you a personal, non-transferable, non-exclusive, revocable license to use the
            Application on any Apple-branded products that you own or control, as permitted by the
            Usage Rules in the Apple Media Services Terms and Conditions, including access by other
            accounts associated with you through Family Sharing or volume purchasing. You may not
            copy, modify, distribute, sell, sublicense, or reverse engineer any part of the
            Application except as permitted by applicable law.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            3. Content You Import — Rights and Responsibilities
          </h2>
          <p className="mb-3">
            The Application lets you import your own audio and text so it can be transcribed,
            segmented into sentences, and studied as a story (&quot;Imported Content&quot;). This
            section governs that feature, and it is the one we ask you to read carefully.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">You must have the right to import it.</strong>{" "}
            You represent and warrant that, for every piece of Imported Content, you either own it,
            hold a licence permitting this use, or are permitted to use it under an exception such
            as fair use or fair dealing in your jurisdiction. You are solely responsible for
            determining that.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">
              Importing infringing material is a breach of this Agreement.
            </strong>{" "}
            You may not import commercial audiobooks, podcasts, films, television, music, ebooks, or
            any other work obtained from an unauthorised source, or any work whose licence does not
            permit reproduction or transcription. Buying a copy of a work does not by itself give
            you the right to upload it here. If you are not sure you hold the necessary rights, do
            not import it.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">What we do with it.</strong> You grant us a
            limited, non-exclusive, worldwide licence to host, store, transcribe, segment, translate
            and generate audio from your Imported Content, solely to provide the Application to you.
            We do not publish it, share it with other users, or use it to train models. This licence
            exists only to run the feature and ends when you delete the content or your account.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">What we keep.</strong> Uploaded audio is
            processed for transcription and is not retained by us. The resulting text is stored in
            your account so the story can be read, along with audio we generate from that text. All
            of it is private to your account and is deleted when you delete the story or your
            account.
          </p>
          <p className="mb-3">
            <strong className="text-[--color-text]">Enforcement.</strong> We may remove Imported
            Content and suspend or terminate accounts where we reasonably believe this section has
            been breached, without notice and without refund. We have no obligation to monitor
            Imported Content, and removing some material does not oblige us to review any other.
          </p>
          <p>
            <strong className="text-[--color-text]">Indemnity.</strong> You will indemnify and hold
            us harmless from any claim, demand, loss, or cost, including reasonable legal fees,
            arising from Imported Content you provided or from your breach of this section.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            4. Copyright Complaints
          </h2>
          <p>
            If you believe material in the Application infringes your copyright, contact us at{" "}
            <a
              href="mailto:legal@terrosdigital.com"
              className="text-[--color-brand] hover:text-[--color-brand-hover] transition-colors"
            >
              legal@terrosdigital.com
            </a>{" "}
            with a description of the work, where it appears, your contact details, and a statement
            that you hold the rights or are authorised to act for the rights holder. We respond to
            valid notices promptly and will remove infringing material and, where appropriate,
            terminate the account responsible.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">5. AI-Generated Content</h2>
          <p className="mb-3">
            The Application uses large language models and speech services to grade your work and
            generate practice material. The sentences you write and the audio you record are sent to
            third-party providers for that purpose — see our{" "}
            <a href="/privacy" className="text-[--color-brand] hover:text-[--color-brand-hover] transition-colors">
              Privacy Policy
            </a>{" "}
            for who they are and what each receives. The Application asks for your consent before
            any of this is shared.
          </p>
          <p>
            Grades, feedback, translations and generated text may be wrong. They are study aids, not
            an authoritative assessment of your ability or an authoritative account of the Chinese
            language. Do not rely on them where accuracy matters.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">6. Subscriptions</h2>
          <p>
            Menzi Pro is an auto-renewing subscription billed through Apple In-App Purchase. Payment
            is charged to your Apple ID at confirmation of purchase and renews automatically unless
            auto-renew is turned off at least 24 hours before the end of the current period. Manage
            or cancel it in your Apple ID settings. Refunds are handled by Apple under its own
            policies.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            7. Maintenance and Support
          </h2>
          <p>
            We are solely responsible for providing any maintenance and support for the Application.
            You and we acknowledge that Apple has no obligation whatsoever to furnish any
            maintenance or support services for the Application.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">8. Warranty</h2>
          <p>
            The Application is provided &quot;as is&quot;, without warranty of any kind to the
            fullest extent permitted by law. We are solely responsible for any product warranties,
            whether express or implied by law, to the extent they are not effectively disclaimed. In
            the event of any failure of the Application to conform to any applicable warranty, you
            may notify Apple, and Apple will refund the purchase price for the Application to you.
            To the maximum extent permitted by applicable law, Apple will have no other warranty
            obligation whatsoever with respect to the Application, and any other claims, losses,
            liabilities, damages, costs or expenses attributable to any failure to conform to any
            warranty will be our sole responsibility.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">9. Product Claims</h2>
          <p>
            You and we acknowledge that we, not Apple, are responsible for addressing any claims by
            you or any third party relating to the Application or your possession and use of it,
            including product liability claims, any claim that the Application fails to conform to
            any applicable legal or regulatory requirement, and claims arising under consumer
            protection, privacy, or similar legislation.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            10. Intellectual Property Rights
          </h2>
          <p>
            You and we acknowledge that, in the event of any third-party claim that the Application
            or your possession and use of it infringes that third party&apos;s intellectual property
            rights, we, not Apple, will be solely responsible for the investigation, defence,
            settlement and discharge of any such claim.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">11. Legal Compliance</h2>
          <p>
            You represent and warrant that you are not located in a country that is subject to a
            U.S. Government embargo, or that has been designated by the U.S. Government as a
            &quot;terrorist supporting&quot; country, and that you are not listed on any U.S.
            Government list of prohibited or restricted parties.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            12. Third Party Terms
          </h2>
          <p>
            You must comply with applicable third-party terms of agreement when using the
            Application, including the Apple Media Services Terms and Conditions and the terms of
            any service you obtain Imported Content from.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            13. Third Party Beneficiary
          </h2>
          <p>
            You and we acknowledge that Apple and Apple&apos;s subsidiaries are third-party
            beneficiaries of this Agreement, and that upon your acceptance of it, Apple will have
            the right (and will be deemed to have accepted the right) to enforce this Agreement
            against you as a third-party beneficiary of it.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            14. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Terros Digital LLC will not be liable for any
            indirect, incidental, special, consequential or punitive damages, or for any loss of
            data, profits or goodwill, arising from your use of the Application. Our total liability
            for any claim will not exceed the amount you paid us in the twelve months preceding the
            claim. Nothing here limits liability that cannot be limited by law.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">15. Termination</h2>
          <p>
            This Agreement is effective until terminated by you or by us. Your rights under it end
            automatically if you fail to comply with any of its terms. You may terminate at any time
            by deleting your account in Settings and removing the Application from your devices.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">16. Governing Law</h2>
          <p>
            This Agreement is governed by the laws of the State of California, United States,
            without regard to its conflict of law principles, except where mandatory local consumer
            law applies to you.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-[--color-text] mb-3">
            17. Contact
          </h2>
          <p className="mb-2">
            Questions, complaints or claims regarding the Application should be directed to:
          </p>
          <p className="mb-1 text-[--color-text]">Terros Digital LLC</p>
          <a
            href="mailto:support@terrosdigital.com"
            className="text-[--color-brand] hover:text-[--color-brand-hover] transition-colors"
          >
            support@terrosdigital.com
          </a>
        </section>
      </div>
    </div>
  );
}
