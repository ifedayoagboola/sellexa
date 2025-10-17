export default function TermsOfServicePage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Sellexa ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Platform Description</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Sellexa is a marketplace platform that connects buyers and sellers of various products and services. Our platform facilitates transactions between users while maintaining a safe and secure environment.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Users can browse and purchase products from verified sellers</li>
              <li>Sellers can list products and manage their inventory</li>
              <li>Secure payment processing and transaction management</li>
              <li>User communication and support features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Creation</h3>
                <p className="text-gray-700 leading-relaxed">
                  To use our platform, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Keep your account information up to date</li>
                  <li>Maintain the security of your password</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Permitted Uses</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Browsing and purchasing products for personal or business use</li>
                  <li>Selling legitimate products and services</li>
                  <li>Communicating with other users in accordance with our guidelines</li>
                  <li>Using platform features as intended</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Violating any applicable laws or regulations</li>
                  <li>Infringing on intellectual property rights</li>
                  <li>Posting false, misleading, or deceptive content</li>
                  <li>Engaging in fraudulent or illegal activities</li>
                  <li>Harassing, threatening, or abusing other users</li>
                  <li>Attempting to gain unauthorized access to our systems</li>
                  <li>Using automated systems to access the platform</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Transactions and Payments</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Processing</h3>
                <p className="text-gray-700 leading-relaxed">
                  All transactions are processed through secure payment gateways. We may collect fees for facilitating transactions as disclosed in our pricing structure.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Transaction Disputes</h3>
                <p className="text-gray-700 leading-relaxed">
                  In case of disputes between buyers and sellers, we provide a dispute resolution process. Our decision in such matters is final and binding.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Sellexa platform, including its design, functionality, and content, is protected by intellectual property laws. Users retain ownership of their content but grant us necessary licenses to operate the platform.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You retain ownership of content you upload</li>
              <li>You grant us license to display and distribute your content</li>
              <li>Respect the intellectual property rights of others</li>
              <li>Report any infringement to our DMCA agent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. We comply with applicable data protection laws including GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the maximum extent permitted by law, Sellexa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account at any time for violations of these terms. You may also terminate your account at any time by contacting our support team.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>We may suspend accounts for policy violations</li>
              <li>You can request account deletion at any time</li>
              <li>Certain data may be retained for legal compliance</li>
              <li>Outstanding transactions must be resolved before termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the platform constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="text-gray-700">
                <strong>Email:</strong> legal@sellexa.app<br />
                <strong>Address:</strong> [Your Business Address]<br />
                <strong>Phone:</strong> [Your Contact Number]
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
