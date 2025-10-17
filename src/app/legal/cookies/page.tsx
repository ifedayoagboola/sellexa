export default function CookiePolicyPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8">
      <div className="prose prose-gray max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
        
        <p className="text-sm text-gray-600 mb-8">
          <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain features to work properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Authentication and login sessions</li>
                  <li>Security features and fraud prevention</li>
                  <li>Shopping cart functionality</li>
                  <li>Basic website navigation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our website.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Page views and user behavior</li>
                  <li>Time spent on pages</li>
                  <li>Popular content and features</li>
                  <li>Error tracking and performance monitoring</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Marketing Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies are used to deliver relevant advertisements and track marketing campaigns.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Personalized advertisements</li>
                  <li>Social media integration</li>
                  <li>Marketing campaign tracking</li>
                  <li>Conversion tracking</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Preference Cookies</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  These cookies remember your choices and preferences to provide a personalized experience.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Language and region settings</li>
                  <li>Display preferences</li>
                  <li>Search history and favorites</li>
                  <li>Notification preferences</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Management</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Browser Settings</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You can control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>View and delete cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block third-party cookies</li>
                  <li>Clear cookies when you close your browser</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Our Cookie Consent Banner</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you first visit our website, you'll see a cookie consent banner where you can:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  <li>Accept all cookies</li>
                  <li>Reject non-essential cookies</li>
                  <li>Customize your cookie preferences</li>
                  <li>Change your preferences at any time</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may use third-party services that set their own cookies. These include:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                <li><strong>Payment Processors:</strong> Secure payment processing</li>
                <li><strong>Social Media:</strong> Social sharing and authentication</li>
                <li><strong>Customer Support:</strong> Live chat and support features</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you disable essential cookies, some features of our website may not work properly, including login, shopping cart, and secure transactions.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Non-Essential Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  Disabling non-essential cookies may affect your experience but won't prevent core functionality. You may see less relevant advertisements and have to re-enter preferences.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Different cookies are stored for different periods:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain for a set period (typically 30 days to 2 years)</li>
              <li><strong>Authentication Cookies:</strong> Usually expire after 30 days of inactivity</li>
              <li><strong>Analytics Cookies:</strong> Typically stored for 2 years</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of significant changes through our website or email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@sellexa.app<br />
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
