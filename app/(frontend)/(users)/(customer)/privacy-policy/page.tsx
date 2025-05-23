import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for our application',
};

export default function PrivacyPolicy() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10 mb-4">Privacy Policy</h1>
        <p className="text-center text-sm mb-6">Last updated: May 2025</p>
        <p className="mb-6 text-center pb-8 border-b">
          This Privacy Policy explains how Fur-Ever Friends collects, uses, and protects your information.
        </p>

        <div className="text-justify space-y-4">

          <section>
            <h2 className="text-xl font-semibold mb-2">1. What We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>For All Users:</strong> Name, email, and contact details
              </li>
              <li>
                <strong>For Adopters:</strong> Preferences related to pet adoption, adoption history
              </li>
              <li>
                <strong>For Shelter Managers:</strong> Shelter credentials and location, animal details (photos, descriptions, medical records)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p>
              We use your data to verify accounts, manage adoptions, enhance user experience, and improve platform performance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Data Protection Measures</h2>
            <p>
              All passwords are hashed using scrypt. Payment keys are encrypted with AES-256. Session expiration, email verification,
              and secure token-based password reset are implemented for security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. User Rights</h2>
            <p>
              You may view, update, or delete your personal data at any time. Account deletion requires email verification for added security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Consent</h2>
            <p>
              By using Fur-Ever Friends, you consent to our data collection and handling as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Legal Compliance</h2>
            <p>
              We comply with Nepalese privacy regulations such as the Privacy Act 2018, and adopt best practices in line with international standards like GDPR.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
