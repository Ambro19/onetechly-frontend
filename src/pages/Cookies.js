// ========================================
// COOKIE POLICY PAGE - PIXELPERFECT
// ========================================
// Professional cookie policy for PixelPerfect Screenshot API
// Production-ready, legally compliant

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Cookies = () => {
  const navigate = useNavigate();
  const lastUpdated = "January 9, 2026";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <PixelPerfectLogo size={40} showText={true} />
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate('/docs')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Documentation
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Pricing
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign in
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy explains how PixelPerfect Screenshot API ("we," "us," or "our") uses cookies and similar tracking technologies when you visit our website at pixelperfectapi.net or use our services. This policy provides you with clear information about the cookies we use and the purposes for which we use them.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By continuing to use our website and services, you consent to our use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should change your browser settings accordingly or discontinue use of our website.
            </p>
          </section>

          {/* What are Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Cookies typically contain two pieces of information: a unique identifier and site name. They allow the website to recognize your device and remember information about your visit, such as your preferences and settings.
            </p>
          </section>

          {/* Types of Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.1 Strictly Necessary Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              These cookies are essential for the website to function properly. They enable core functionality such as:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Authentication:</strong> Keeping you logged in to your account</li>
              <li><strong>Security:</strong> Protecting against fraudulent activity and maintaining secure sessions</li>
              <li><strong>API Access:</strong> Managing your API authentication tokens</li>
              <li><strong>Load Balancing:</strong> Distributing traffic across our servers</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Duration:</strong> Session cookies (deleted when you close your browser) or up to 30 days for persistent authentication.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Can be disabled:</strong> No - these cookies are essential for the website to function.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.2 Performance and Analytics Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              These cookies collect information about how you use our website, helping us improve performance and user experience:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Page Views:</strong> Which pages you visit and how long you spend on them</li>
              <li><strong>Navigation Patterns:</strong> How you navigate through our website</li>
              <li><strong>Error Tracking:</strong> Identifying technical issues or broken links</li>
              <li><strong>Performance Metrics:</strong> Page load times and response rates</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Duration:</strong> Up to 2 years
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Can be disabled:</strong> Yes - through browser settings or cookie preferences
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.3 Functional Cookies</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              These cookies allow the website to remember your choices and provide enhanced features:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Language Preferences:</strong> Your selected language or region</li>
              <li><strong>Display Settings:</strong> Theme preferences (light/dark mode)</li>
              <li><strong>Form Data:</strong> Remembered information in forms</li>
              <li><strong>API Settings:</strong> Your default screenshot configurations</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              <strong>Duration:</strong> Up to 1 year
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              <strong>Can be disabled:</strong> Yes - but some features may not work properly
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">3.4 Targeting and Advertising Cookies</h3>
            <p className="text-gray-700 leading-relaxed">
              We currently do not use targeting or advertising cookies. If this changes in the future, we will update this policy and request your consent where required by law.
            </p>
          </section>

          {/* Specific Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Specific Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      Cookie Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      Purpose
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">session_token</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Maintains your logged-in session</td>
                    <td className="px-6 py-4 text-sm text-gray-700">30 days</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Essential</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">csrf_token</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Protects against cross-site request forgery</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Session</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Essential</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">api_token</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Authenticates API requests</td>
                    <td className="px-6 py-4 text-sm text-gray-700">90 days</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Essential</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">user_prefs</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Stores your preferences and settings</td>
                    <td className="px-6 py-4 text-sm text-gray-700">1 year</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Functional</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">_analytics_id</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Tracks anonymous usage statistics</td>
                    <td className="px-6 py-4 text-sm text-gray-700">2 years</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Analytics</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">cookie_consent</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Remembers your cookie preferences</td>
                    <td className="px-6 py-4 text-sm text-gray-700">1 year</td>
                    <td className="px-6 py-4 text-sm text-gray-700">Essential</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Third-Party Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use services from trusted third-party providers who may also set cookies on your device:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.1 Stripe (Payment Processing)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Purpose:</strong> Securely process subscription payments</li>
              <li><strong>Cookies:</strong> __stripe_mid, __stripe_sid</li>
              <li><strong>Duration:</strong> 1 year (mid), 30 minutes (sid)</li>
              <li><strong>Privacy Policy:</strong> <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">stripe.com/privacy</a></li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">5.2 Cloudflare (Security & Performance)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Purpose:</strong> Protect against malicious traffic and improve performance</li>
              <li><strong>Cookies:</strong> __cf_bm, __cflb</li>
              <li><strong>Duration:</strong> 30 minutes to 1 day</li>
              <li><strong>Privacy Policy:</strong> <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cloudflare.com/privacypolicy</a></li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-6">
              We do not control these third-party cookies. Please refer to the respective privacy policies of these services for more information.
            </p>
          </section>

          {/* Cookie Management */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. How to Manage Cookies</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.1 Browser Settings</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>View what cookies are stored and delete them individually or all at once</li>
              <li>Block third-party cookies</li>
              <li>Block cookies from specific websites</li>
              <li>Block all cookies</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.2 Browser-Specific Instructions</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                  <br />
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    support.google.com/chrome/answer/95647
                  </a>
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                  <br />
                  <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    support.mozilla.org/en-US/kb/enhanced-tracking-protection
                  </a>
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  <strong>Safari:</strong> Preferences → Privacy → Cookies and website data
                  <br />
                  <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    support.apple.com/guide/safari/manage-cookies
                  </a>
                </p>
              </div>
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-700">
                  <strong>Edge:</strong> Settings → Privacy, search, and services → Cookies
                  <br />
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                    support.microsoft.com/en-us/microsoft-edge
                  </a>
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">6.3 Cookie Consent Preferences</h3>
            <p className="text-gray-700 leading-relaxed">
              When you first visit our website, we will ask for your consent to use non-essential cookies. You can change your cookie preferences at any time by clicking the "Cookie Settings" link in the footer of our website.
            </p>
          </section>

          {/* Impact of Disabling Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Impact of Disabling Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Disabling cookies may affect your ability to use certain features of our website:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Essential Cookies:</strong> You will not be able to log in or access your account</li>
              <li><strong>Functional Cookies:</strong> Your preferences will not be remembered between sessions</li>
              <li><strong>Analytics Cookies:</strong> We will be unable to improve our service based on usage patterns</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our API functionality will continue to work as it uses token-based authentication rather than browser cookies.
            </p>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Do Not Track Signals</h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no industry standard for how to respond to DNT signals. We do not currently respond to DNT browser signals, but we respect your right to privacy and provide you with control over cookies through this Cookie Policy and your browser settings.
            </p>
          </section>

          {/* Similar Technologies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Other Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              In addition to cookies, we may use other technologies to enhance your experience:
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.1 Local Storage</h3>
            <p className="text-gray-700 leading-relaxed">
              We use HTML5 local storage to cache data locally on your device for faster page loading and to store non-sensitive preferences. This data remains on your device until you clear your browser cache.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.2 Session Storage</h3>
            <p className="text-gray-700 leading-relaxed">
              We use session storage to temporarily store data during your browsing session. This data is automatically deleted when you close your browser tab.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.3 Web Beacons</h3>
            <p className="text-gray-700 leading-relaxed">
              We do not currently use web beacons (also known as pixel tags or clear GIFs). If this changes in the future, we will update this policy.
            </p>
          </section>

          {/* International Users */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Users</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our services are hosted in the United States. If you are accessing our website from outside the United States:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your information, including cookies, may be transferred to and stored on servers in the United States</li>
              <li>We comply with applicable data protection laws, including GDPR for EU users</li>
              <li>You have the right to withdraw consent for non-essential cookies at any time</li>
            </ul>
          </section>

          {/* Updates to Cookie Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Cookie Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date at the top of this policy.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies.
            </p>
          </section>

          {/* More Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. More Information About Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To learn more about cookies and how they work, you can visit these resources:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">All About Cookies</a> - Comprehensive cookie information</li>
              <li><a href="https://www.aboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">About Cookies</a> - Cookie management guidance</li>
              <li><a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Your Online Choices</a> - EU cookie control (for EU users)</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700"><strong>PixelPerfect Screenshot API</strong></p>
              <p className="text-gray-700">OneTechly</p>
              <p className="text-gray-700">New York, NY, United States</p>
              <p className="text-gray-700 mt-3">
                Email: <a href="mailto:privacy@pixelperfectapi.net" className="text-blue-600 hover:underline">privacy@pixelperfectapi.net</a>
              </p>
              <p className="text-gray-700">
                Support: <a href="mailto:support@pixelperfectapi.net" className="text-blue-600 hover:underline">support@pixelperfectapi.net</a>
              </p>
            </div>
          </section>

          {/* Related Policies */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Related Policies</h2>
            <p className="text-gray-700 leading-relaxed">
              This Cookie Policy should be read in conjunction with our:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>
                <button onClick={() => navigate('/privacy')} className="text-blue-600 hover:underline">
                  Privacy Policy
                </button> - How we collect, use, and protect your data
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="text-blue-600 hover:underline">
                  Terms of Service
                </button> - Terms governing your use of our service
              </li>
            </ul>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              By continuing to use PixelPerfect Screenshot API, you acknowledge that you have read and understood this Cookie Policy and consent to our use of cookies as described herein.
            </p>
          </section>

        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Home
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <PixelPerfectLogo size={32} showText={true} textColor="text-white" />
              <p className="text-xs text-gray-400 mt-2">© 2026 All rights reserved</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white">Privacy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white">Terms</button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Cookies;