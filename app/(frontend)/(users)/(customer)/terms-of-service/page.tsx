import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for using Fur-Ever Friends',
};

export default function TermsOfService() {
  return (
    <>
      <main className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mt-10 mb-4">Terms of Service</h1>
        <p className="text-center text-sm mb-6">Last updated: May 2025</p>
        <p className="mb-6 text-justify pb-8 border-b">
          These Terms of Service ("Terms") govern your use of Fur-Ever Friends ("the Platform"). By accessing or using the Platform, you agree to be bound by these Terms.
        </p>

        <div className="text-justify space-y-4">

          <section>
            <h2 className="text-xl font-semibold mb-2">1. General</h2>
            <p>
              Fur-Ever Friends is an online platform that connects verified animal shelters with potential adopters. The Platform acts as a facilitator and does not directly manage adoptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Terms for Customers (Adopters)</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Must be at least 18 years old and provide accurate information.</li>
              <li>Agree to provide lifelong, humane care for adopted animals.</li>
              <li>May not adopt animals for resale or unethical breeding.</li>
              <li>Rehoming must be done responsibly using the Rehome Assistance feature if needed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Terms for Shelter Managers</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Shelters must be verified by the platform before listing animals.</li>
              <li>All listings must represent real, current animals in custody.</li>
              <li>Animal descriptions must be honest, including health and behavioral notes.</li>
              <li>Shelters must follow ethical adoption practices and discourage illegal breeding.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Account Suspension or Termination</h2>
            <p>
              Fur-Ever Friends reserves the right to suspend or terminate accounts that violate these terms, including accounts involved in harassment, fraud, or misuse of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Modifications to the Terms</h2>
            <p>
              We may update these Terms periodically. Continued use of the platform indicates your acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
            <p>
              If you have any questions regarding these Terms, please contact us at <strong>support@fureverfriends.com</strong>.
            </p>
          </section>

        </div>
      </main>
    </>
  );
}
