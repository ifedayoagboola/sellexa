export default function DMCAPolicyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">DMCA & Copyright Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Digital Millennium Copyright Act (DMCA) Compliance</h2>
          <p className="text-blue-800">
            Sellexa respects intellectual property rights and complies with the DMCA. We have established procedures 
            for addressing copyright infringement claims and protecting both rights holders and users.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Copyright Infringement Claims</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">What Constitutes Infringement</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Unauthorized use of copyrighted images, text, or designs</li>
                  <li>Sale of counterfeit or replica products</li>
                  <li>Distribution of copyrighted content without permission</li>
                  <li>Use of trademarked logos or brand names without authorization</li>
                  <li>Sale of pirated software, music, movies, or other media</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Response to Claims</h3>
                <p className="text-gray-700 leading-relaxed">
                  When we receive a valid DMCA takedown notice, we will promptly remove or disable access to the 
                  allegedly infringing content and notify the user who posted it.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Filing a DMCA Takedown Notice</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Required Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To file a DMCA takedown notice, please provide the following information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>Contact Information:</strong> Your name, address, phone number, and email</li>
                  <li><strong>Copyrighted Work:</strong> Description of the copyrighted work you claim has been infringed</li>
                  <li><strong>Infringing Content:</strong> Specific location of the allegedly infringing content on our platform</li>
                  <li><strong>Good Faith Statement:</strong> Statement that you believe the use is not authorized</li>
                  <li><strong>Accuracy Statement:</strong> Statement that the information is accurate and you are authorized to act</li>
                  <li><strong>Signature:</strong> Physical or electronic signature</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Where to Send Notices</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>DMCA Agent:</strong> dmca@sellexa.app<br />
                    <strong>Subject Line:</strong> DMCA Takedown Notice<br />
                    <strong>Address:</strong> [Your Business Address]<br />
                    <strong>Phone:</strong> [Your Contact Number]
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Counter-Notification Process</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">If Your Content Was Removed</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you believe your content was removed in error, you may file a counter-notification. 
                  This is a legal document that must include specific information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Counter-Notification Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Your contact information</li>
                  <li>Identification of the removed content and its location</li>
                  <li>Statement under penalty of perjury that you believe the removal was in error</li>
                  <li>Consent to the jurisdiction of federal court</li>
                  <li>Consent to accept service of process from the complainant</li>
                  <li>Your physical or electronic signature</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Repeat Infringer Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Termination</h3>
                <p className="text-gray-700 leading-relaxed">
                  Users who repeatedly infringe copyright may have their accounts terminated. We maintain 
                  records of DMCA notices and implement a "three strikes" policy for repeat offenders.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appeals Process</h3>
                <p className="text-gray-700 leading-relaxed">
                  Users who believe their account was terminated in error can appeal the decision by 
                  providing evidence that they have the right to use the copyrighted material.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Fair Use and Exceptions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Fair Use Considerations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Educational or commentary purposes</li>
                  <li>Parody or satire</li>
                  <li>News reporting</li>
                  <li>Research and criticism</li>
                  <li>Transformative use that adds new meaning</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Public Domain Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  Content in the public domain is not protected by copyright and may be used freely. 
                  However, users should verify that content is truly in the public domain.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Trademark Issues</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trademark Infringement</h3>
                <p className="text-gray-700 leading-relaxed">
                  While DMCA specifically addresses copyright, we also handle trademark infringement claims. 
                  Trademark issues are addressed through our general intellectual property policy.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Common Trademark Violations</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Unauthorized use of brand names or logos</li>
                  <li>Sale of counterfeit products</li>
                  <li>Domain name or username squatting</li>
                  <li>Misleading brand associations</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. International Considerations</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Global Compliance</h3>
                <p className="text-gray-700 leading-relaxed">
                  While DMCA is a U.S. law, we respect intellectual property rights globally and comply 
                  with applicable laws in all jurisdictions where we operate.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">International Laws</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>EU Copyright Directive</li>
                  <li>Canadian Copyright Act</li>
                  <li>UK Copyright, Designs and Patents Act</li>
                  <li>Local intellectual property laws</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. False Claims and Penalties</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">False DMCA Claims</h3>
                <p className="text-gray-700 leading-relaxed">
                  Knowingly making false DMCA claims is illegal and may result in liability for damages, 
                  including costs and attorney fees.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Protection</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>We require good faith statements in all notices</li>
                  <li>We may seek verification of claims</li>
                  <li>We maintain records of all notices</li>
                  <li>We may take action against false claimants</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. User Education</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Best Practices</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Only use content you own or have permission to use</li>
                  <li>Understand fair use limitations</li>
                  <li>Respect trademark rights</li>
                  <li>When in doubt, seek permission</li>
                  <li>Use royalty-free or Creative Commons content</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Resources</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>U.S. Copyright Office website</li>
                  <li>Creative Commons licensing information</li>
                  <li>Fair use guidelines</li>
                  <li>Trademark databases and resources</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For DMCA-related questions and notices:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>DMCA Agent:</strong> dmca@sellexa.app<br />
                <strong>Legal Department:</strong> legal@sellexa.app<br />
                <strong>Address:</strong> [Your Business Address]<br />
                <strong>Phone:</strong> [Your Contact Number]<br />
                <strong>Response Time:</strong> We typically respond within 24-48 hours
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
