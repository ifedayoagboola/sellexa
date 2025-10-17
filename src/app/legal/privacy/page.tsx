export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">GDPR Compliance Notice</h2>
          <p className="text-blue-800">
            This Privacy Policy complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws. 
            We are committed to protecting your privacy and handling your personal data responsibly.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, profile picture</li>
                  <li><strong>Identity Verification:</strong> Government-issued ID, business documents (for sellers)</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely)</li>
                  <li><strong>Communication Data:</strong> Messages sent through our platform</li>
                  <li><strong>Location Data:</strong> City, country (for local marketplace features)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on platform</li>
                  <li>Search queries and preferences</li>
                  <li>Transaction history and interactions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Basis for Processing (GDPR Article 6)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Contract Performance:</strong> To provide our marketplace services</li>
                  <li><strong>Legitimate Interest:</strong> To improve our platform and prevent fraud</li>
                  <li><strong>Consent:</strong> For marketing communications and non-essential cookies</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Specific Uses</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Facilitate transactions between buyers and sellers</li>
                  <li>Verify user identity and prevent fraud</li>
                  <li>Provide customer support and resolve disputes</li>
                  <li>Send important service notifications</li>
                  <li>Improve platform functionality and user experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Marketing communications (with your consent)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">We May Share Information With:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Other Users:</strong> Public profile information and product listings</li>
                  <li><strong>Payment Processors:</strong> To process transactions securely</li>
                  <li><strong>Service Providers:</strong> Third-party vendors who assist our operations</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">We Never Sell Your Personal Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure data storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights (GDPR)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Data Subject Rights</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Right of Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                  <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for consent-based processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">How to Exercise Your Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  To exercise any of these rights, please contact us at privacy@sellexa.app. We will respond within 30 days and may require identity verification.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Types of Cookies We Use</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand user behavior</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cookie Management</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookies through your browser settings or our cookie consent banner. Note that disabling certain cookies may affect platform functionality.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law.
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Account Data:</strong> Until account deletion or 3 years of inactivity</li>
              <li><strong>Transaction Records:</strong> 7 years for tax and legal compliance</li>
              <li><strong>Communication Data:</strong> 2 years for customer support purposes</li>
              <li><strong>Marketing Data:</strong> Until consent is withdrawn</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be transferred to and processed in countries outside the European Economic Area (EEA). We ensure appropriate safeguards are in place, including Standard Contractual Clauses and adequacy decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our platform is not intended for children under 16. We do not knowingly collect personal information from children under 16. If we become aware of such collection, we will take steps to delete the information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes via email or platform notification. Continued use of our platform constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For privacy-related questions, data protection requests, or to contact our Data Protection Officer:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Privacy Email:</strong> privacy@sellexa.app<br />
                <strong>Data Protection Officer:</strong> dpo@sellexa.app<br />
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
