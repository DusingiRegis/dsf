import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[#C9A84C] mb-6 hover:underline">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold text-[#0B1F3A] mb-8">Terms & Conditions</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-[#6B7280]">
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using our website, you agree to be bound by these Terms and Conditions.
              If you disagree with any part of these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">2. Services</h2>
            <p>
              D.E.F Real Estate provides real estate brokerage services, including property listings for sale and rent,
              property management services, and client property submission services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">3. Property Listings</h2>
            <p>
              We make every effort to ensure that property information on our website is accurate and up-to-date.
              However, we cannot guarantee that all details are complete, reliable, or error-free.
              Property availability and prices are subject to change without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">4. Property Submissions</h2>
            <p>
              When you submit a property for listing through our website, you confirm that:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>You are the legal owner of the property or have the right to list it.</li>
              <li>All information provided is accurate and complete.</li>
              <li>We reserve the right to reject or remove any property listing at our discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">5. User Responsibilities</h2>
            <p>
              You agree to use our website only for lawful purposes and in a way that does not infringe the rights of
              others or restrict their use and enjoyment of the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">6. Limitation of Liability</h2>
            <p>
              D.E.F Real Estate will not be liable for any indirect, incidental, special, consequential, or punitive damages,
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Rwanda.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time at our sole discretion.
              It is your responsibility to check these Terms periodically for changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
              <br /><br />
              Email: dusabeyezuemmanuel99@gmail.com
              <br />
              Phone: +250 788 909 960
              <br />
              Location: Kigali, Rwanda
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-8 border-t border-gray-100">
            Last updated: June 2026
          </p>
        </div>
      </div>
    </main>
  );
}