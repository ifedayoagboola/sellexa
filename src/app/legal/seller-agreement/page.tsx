export default function SellerAgreementPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Seller Agreement</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-yellow-900 mb-2">Important Notice</h2>
          <p className="text-yellow-800">
            This agreement governs your use of Sellexa as a seller. By creating a seller account and listing products, 
            you agree to be bound by these terms. Please read this agreement carefully.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Seller Eligibility</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Must be at least 18 years old</li>
                  <li>Provide accurate business information</li>
                  <li>Complete identity verification process</li>
                  <li>Have a valid bank account for payments</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Business Verification</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may require additional verification for business accounts, including business registration documents, 
                  tax identification numbers, and other relevant business information.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Account Setup and Management</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Provide accurate and complete business information</li>
                  <li>Maintain up-to-date contact information</li>
                  <li>Keep payment and banking details current</li>
                  <li>Notify us of any changes to business structure</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Security</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for maintaining the security of your seller account. Use strong passwords, 
                  enable two-factor authentication when available, and notify us immediately of any unauthorized access.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Product Listings</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Listing Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Accurate product descriptions and specifications</li>
                  <li>High-quality product images</li>
                  <li>Correct pricing and availability information</li>
                  <li>Compliance with our Prohibited Items Policy</li>
                  <li>Proper categorization and tagging</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Product Quality Standards</h3>
                <p className="text-gray-700 leading-relaxed">
                  All products must meet quality standards and be accurately represented. You are responsible for ensuring 
                  products are safe, legal, and match their descriptions.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Pricing and Fees</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Fees</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We charge fees for using our platform services. Current fee structure:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Listing Fee:</strong> [X]% per successful sale</li>
                  <li><strong>Payment Processing:</strong> [X]% transaction fee</li>
                  <li><strong>Premium Features:</strong> Additional fees for enhanced listings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Pricing Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Set competitive and fair prices</li>
                  <li>Include all applicable taxes in pricing</li>
                  <li>Honor advertised prices and promotions</li>
                  <li>Notify customers of any price changes</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Order Processing and Fulfillment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order Management</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Process orders within specified timeframes</li>
                  <li>Update order status promptly</li>
                  <li>Provide tracking information when available</li>
                  <li>Communicate with customers about delays</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping and Delivery</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for shipping products safely and on time. Provide accurate shipping information 
                  and use reliable shipping methods. Consider offering tracking and insurance options.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Customer Service</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Communication Standards</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Respond to customer inquiries within 24 hours</li>
                  <li>Provide professional and helpful support</li>
                  <li>Resolve disputes in good faith</li>
                  <li>Maintain respectful communication</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Returns and Refunds</h3>
                <p className="text-gray-700 leading-relaxed">
                  Follow our Returns and Refunds Policy. Process returns promptly and issue refunds according to 
                  our platform policies and applicable consumer protection laws.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Processing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Schedule</h3>
                <p className="text-gray-700 leading-relaxed">
                  Payments are typically processed within [X] business days after order completion, minus applicable fees. 
                  Payment schedules may vary based on account status and transaction volume.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Methods</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Bank transfers to verified accounts</li>
                  <li>Digital payment platforms</li>
                  <li>Other approved payment methods</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Compliance and Legal Requirements</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Compliance</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Obtain necessary licenses and permits</li>
                  <li>Follow consumer protection laws</li>
                  <li>Respect intellectual property rights</li>
                  <li>Meet product safety standards</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tax Responsibilities</h3>
                <p className="text-gray-700 leading-relaxed">
                  You are responsible for all tax obligations related to your sales, including income tax, sales tax, 
                  VAT, and other applicable taxes. Consult with a tax professional for guidance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Platform Policies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Compliance</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Prohibited Items Policy</li>
                  <li>Returns and Refunds Policy</li>
                  <li>Community Guidelines</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Violations</h3>
                <p className="text-gray-700 leading-relaxed">
                  Violations of platform policies may result in warnings, listing removal, account suspension, 
                  or termination. We reserve the right to take appropriate action to maintain platform integrity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You retain ownership of your product content but grant us necessary licenses to operate the platform:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>You own your product images and descriptions</li>
              <li>You grant us license to display and promote your products</li>
              <li>Respect third-party intellectual property rights</li>
              <li>Report any IP violations to our team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Termination by You</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may terminate your seller account at any time by contacting our support team. Outstanding 
                  orders must be fulfilled before account closure.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Termination by Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may suspend or terminate accounts for policy violations, legal compliance issues, or other 
                  reasons as outlined in our Terms of Service.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about this Seller Agreement or seller-related matters:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Seller Support:</strong> sellers@sellexa.app<br />
                <strong>Legal Questions:</strong> legal@sellexa.app<br />
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
