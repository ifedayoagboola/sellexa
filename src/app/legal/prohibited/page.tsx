export default function ProhibitedItemsPolicyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Prohibited Items Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Important Notice</h2>
          <p className="text-red-800">
            The sale of prohibited items is strictly forbidden on Sellexa. Violation of this policy may result in 
            immediate account suspension or termination. Please review this list carefully before listing any items.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Illegal Items</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Controlled Substances</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Illegal drugs and narcotics</li>
                  <li>Prescription medications without valid prescription</li>
                  <li>Drug paraphernalia</li>
                  <li>Substances used to manufacture illegal drugs</li>
                  <li>Anabolic steroids and performance-enhancing drugs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Weapons and Dangerous Items</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Firearms and ammunition</li>
                  <li>Explosives and fireworks</li>
                  <li>Knives and blades (except kitchen/utility knives)</li>
                  <li>Stun guns and tasers</li>
                  <li>Self-defense sprays</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Harmful and Dangerous Products</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Health and Safety Risks</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Unregulated medical devices</li>
                  <li>Cosmetics and supplements not approved by regulatory bodies</li>
                  <li>Hazardous chemicals and toxins</li>
                  <li>Asbestos and lead-based products</li>
                  <li>Products with known safety recalls</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Children's Safety</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Toys with small parts for children under 3</li>
                  <li>Products with choking hazards</li>
                  <li>Unsafe children's furniture</li>
                  <li>Products banned by child safety organizations</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Counterfeit and Infringing Items</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Intellectual Property Violations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Counterfeit designer goods</li>
                  <li>Bootleg movies, music, and software</li>
                  <li>Unauthorized replicas of branded products</li>
                  <li>Items with copyrighted logos or designs</li>
                  <li>Pirated media and software</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trademark Violations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Products using unauthorized brand names</li>
                  <li>Items with fake brand markings</li>
                  <li>Unauthorized merchandise</li>
                  <li>Products that mislead about brand affiliation</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Adult and Inappropriate Content</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Adult Products</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Adult toys and intimate products</li>
                  <li>Pornographic materials</li>
                  <li>Adult-oriented clothing and accessories</li>
                  <li>Products promoting adult entertainment</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Offensive Content</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Items promoting hate speech or discrimination</li>
                  <li>Products with offensive language or imagery</li>
                  <li>Items that promote violence</li>
                  <li>Content inappropriate for general audiences</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Animals and Animal Products</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Live Animals</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Live animals of any kind</li>
                  <li>Pet breeding services</li>
                  <li>Wildlife and exotic animals</li>
                  <li>Animals for food production</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Animal Products</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Fur and exotic animal skins</li>
                  <li>Ivory and products from endangered species</li>
                  <li>Products tested on animals (where prohibited)</li>
                  <li>Animal parts and derivatives</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Financial and Investment Items</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Financial Services</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Investment opportunities and schemes</li>
                  <li>Cryptocurrency and digital assets</li>
                  <li>Gift cards and prepaid cards</li>
                  <li>Financial instruments and securities</li>
                  <li>Money transfer services</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Currency and Precious Metals</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Counterfeit currency</li>
                  <li>Bullion and precious metals trading</li>
                  <li>Collectible coins and currency</li>
                  <li>Investment-grade precious metals</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Services and Intangible Items</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prohibited Services</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Escort and adult services</li>
                  <li>Academic cheating services</li>
                  <li>Identity theft and fraud services</li>
                  <li>Hacking and cybercrime services</li>
                  <li>Services that violate platform policies</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Digital Products</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Pirated software and media</li>
                  <li>Hacked accounts and credentials</li>
                  <li>Malware and viruses</li>
                  <li>Unauthorized digital subscriptions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Restricted Categories</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Items Requiring Special Approval</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Alcohol and tobacco products</li>
                  <li>Automotive parts and accessories</li>
                  <li>Health and beauty supplements</li>
                  <li>Electronics with specific certifications</li>
                  <li>Food and consumable products</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Age-Restricted Items</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Products requiring age verification</li>
                  <li>Items with legal age restrictions</li>
                  <li>Products that may be harmful to minors</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Enforcement and Penalties</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Violations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Immediate listing removal</li>
                  <li>Account warnings and restrictions</li>
                  <li>Temporary or permanent account suspension</li>
                  <li>Legal action for serious violations</li>
                  <li>Reporting to relevant authorities</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reporting Violations</h3>
                <p className="text-gray-700 leading-relaxed">
                  Users can report prohibited items through our reporting system. We investigate all reports 
                  promptly and take appropriate action to maintain platform integrity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Appeals Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appealing Decisions</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you believe your item was incorrectly flagged as prohibited, you can appeal the decision 
                  by providing additional documentation and context.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appeal Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Detailed explanation of the item</li>
                  <li>Documentation proving compliance</li>
                  <li>Certification or approval documents</li>
                  <li>Legal opinion if applicable</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about prohibited items or to report violations:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Policy Questions:</strong> policy@sellexa.app<br />
                <strong>Report Violations:</strong> report@sellexa.app<br />
                <strong>Appeals:</strong> appeals@sellexa.app<br />
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
