export default function ReturnsRefundsPolicyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Returns & Refunds Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-2">Customer Satisfaction Guarantee</h2>
          <p className="text-green-800">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            we'll work with you to make it right.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Return Eligibility</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Items Eligible for Return</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Items received in damaged or defective condition</li>
                  <li>Items that don't match the description</li>
                  <li>Wrong items sent by the seller</li>
                  <li>Items with manufacturing defects</li>
                  <li>Unwanted items (subject to seller's return policy)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Return Timeframes</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Defective/Damaged Items:</strong> 30 days from delivery</li>
                  <li><strong>Wrong Items:</strong> 14 days from delivery</li>
                  <li><strong>Unwanted Items:</strong> As specified by individual sellers (typically 7-14 days)</li>
                  <li><strong>Digital Products:</strong> Generally non-returnable unless defective</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Return Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Step-by-Step Process</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li><strong>Contact Seller:</strong> Reach out to the seller through our messaging system</li>
                  <li><strong>Explain Issue:</strong> Describe the problem and provide photos if applicable</li>
                  <li><strong>Seller Response:</strong> Seller has 48 hours to respond</li>
                  <li><strong>Return Authorization:</strong> If approved, seller provides return instructions</li>
                  <li><strong>Ship Item:</strong> Package and ship the item according to instructions</li>
                  <li><strong>Processing:</strong> Seller processes return and issues refund</li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Order number and date</li>
                  <li>Reason for return</li>
                  <li>Photos of the issue (if applicable)</li>
                  <li>Preferred resolution (refund, exchange, repair)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Return Conditions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Item Condition Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Items must be in original condition (unless defective)</li>
                  <li>Original packaging and tags included when possible</li>
                  <li>All accessories and documentation included</li>
                  <li>Items must be unused (except for testing defective items)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Items Not Eligible for Return</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Personalized or custom-made items</li>
                  <li>Perishable goods</li>
                  <li>Intimate or sanitary products</li>
                  <li>Digital products (unless defective)</li>
                  <li>Items damaged by misuse or normal wear</li>
                  <li>Items returned after the specified timeframe</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Shipping and Costs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Return Shipping</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Seller's Fault:</strong> Seller pays return shipping costs</li>
                  <li><strong>Defective Items:</strong> Seller pays return shipping costs</li>
                  <li><strong>Wrong Items:</strong> Seller pays return shipping costs</li>
                  <li><strong>Change of Mind:</strong> Buyer typically pays return shipping</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Requirements</h3>
                <p className="text-gray-700 leading-relaxed">
                  Use trackable shipping methods and keep receipts. We recommend insuring valuable items. 
                  Return shipping labels may be provided by the seller for eligible returns.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Refund Processing</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Timeline</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Processing Time:</strong> 3-5 business days after item received</li>
                  <li><strong>Payment Method:</strong> Refunded to original payment method</li>
                  <li><strong>Bank Processing:</strong> Additional 3-10 business days depending on bank</li>
                  <li><strong>Digital Wallets:</strong> Typically faster processing</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Amount</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Full refund for defective or wrong items</li>
                  <li>Partial refunds may apply for damaged packaging</li>
                  <li>Original shipping costs refunded if seller's fault</li>
                  <li>Restocking fees may apply (disclosed upfront)</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Exchanges</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Exchange Process</h3>
                <p className="text-gray-700 leading-relaxed">
                  Exchanges are handled at the seller's discretion. Contact the seller to request an exchange. 
                  Availability depends on seller's inventory and policies.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Exchange Conditions</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Items must be in original condition</li>
                  <li>Same item in different size/color preferred</li>
                  <li>Price differences may apply</li>
                  <li>Shipping costs for exchanges may vary</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Dispute Resolution</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">When to Escalate</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you're unable to resolve the issue directly with the seller, you can escalate to our 
                  customer support team for mediation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Role</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Review the case and documentation</li>
                  <li>Mediate between buyer and seller</li>
                  <li>Make fair decisions based on policies</li>
                  <li>Process refunds when appropriate</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Returns</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Cross-Border Returns</h3>
                <p className="text-gray-700 leading-relaxed">
                  International returns may be subject to customs duties and additional shipping costs. 
                  Buyers are typically responsible for these costs unless the return is due to seller error.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Considerations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Longer processing times for international returns</li>
                  <li>Customs documentation required</li>
                  <li>Currency conversion for refunds</li>
                  <li>Local consumer protection laws may apply</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Consumer Rights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  This policy doesn't affect your statutory rights under consumer protection laws. 
                  You may have additional rights depending on your location.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Distance Selling Regulations</h3>
                <p className="text-gray-700 leading-relaxed">
                  For online purchases, you may have the right to cancel within 14 days of delivery 
                  under distance selling regulations, regardless of this policy.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about returns and refunds:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Customer Support:</strong> support@sellexa.app<br />
                <strong>Returns Department:</strong> returns@sellexa.app<br />
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
