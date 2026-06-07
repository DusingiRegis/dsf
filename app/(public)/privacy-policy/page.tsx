import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="py-16 bg-[#F5F5F5]">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-[#C9A84C] mb-6 hover:underline">
          ← Back
        </Link>
        <h1 className="text-4xl font-bold text-[#0B1F3A] mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 text-[#6B7280]">
          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">1. Introduction</h2>
            <p>
              Welcome to D.E.F Real Estate. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">2. Data We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>Identity Data: includes first name, last name, username or similar identifier.</li>
              <li>Contact Data: includes email address and telephone numbers.</li>
              <li>Property Data: includes property preferences, submission details.</li>
              <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">3. How We Use Your Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>To respond to your property inquiries.</li>
              <li>To manage property submissions.</li>
              <li>To send you newsletters (if you have opted in).</li>
              <li>To improve our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">4. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">5. Cookies</h2>
            <p>
              We use cookies to improve your experience on our website. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">6. Your Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to access, correct, or erase your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#0B1F3A] mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at:
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