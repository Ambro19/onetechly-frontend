// ========================================
// PRIVACY POLICY PAGE - PIXELPERFECT
// ========================================
// Professional privacy policy for PixelPerfect Screenshot API
// Production-ready, legally compliant

import React from 'react';
import { useNavigate } from 'react-router-dom';
import PixelPerfectLogo from '../components/PixelPerfectLogo';

const Privacy = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to PixelPerfect Screenshot API ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our screenshot API service at pixelperfectapi.net.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using PixelPerfect, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you register for an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Information:</strong> Username, email address, and encrypted password</li>
              <li><strong>Contact Information:</strong> Email address for account verification and communication</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Usage Data</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We automatically collect information about your use of our service:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>API Usage:</strong> Number of screenshots taken, API endpoints accessed, request timestamps</li>
              <li><strong>Screenshot Data:</strong> URLs captured, screenshot metadata (dimensions, format, timestamps)</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Log Data:</strong> Access times, pages viewed, error logs, API response codes</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 Cookies and Tracking Technologies</h3>
            <p className="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service. See our <button onClick={() => navigate('/cookies')} className="text-blue-600 hover:underline">Cookie Policy</button> for more details.
            </p>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our screenshot API service</li>
              <li><strong>Account Management:</strong> To create and manage your account, authenticate access</li>
              <li><strong>Payment Processing:</strong> To process subscription payments and manage billing</li>
              <li><strong>Usage Monitoring:</strong> To track API usage against your subscription tier limits</li>
              <li><strong>Communication:</strong> To send service updates, technical notices, and support responses</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical issues and fraud</li>
              <li><strong>Analytics:</strong> To analyze usage patterns and improve our service</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. How We Share Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.1 Service Providers</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Stripe:</strong> Payment processing (subject to Stripe's privacy policy)</li>
              <li><strong>Cloud Infrastructure:</strong> AWS/Cloudflare for hosting and content delivery</li>
              <li><strong>Analytics:</strong> Anonymous usage analytics to improve our service</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Legal Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law, court order, or government regulation, or to protect our rights, property, or safety.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Business Transfers</h3>
            <p className="text-gray-700 leading-relaxed">
              If PixelPerfect is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after deletion</li>
              <li><strong>Screenshots:</strong> Stored for 30 days unless you delete them earlier</li>
              <li><strong>Usage Logs:</strong> Retained for 12 months for security and analytics</li>
              <li><strong>Payment Records:</strong> Retained for 7 years for tax and legal compliance</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement appropriate technical and organizational measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Encryption:</strong> All data transmitted is encrypted using TLS/SSL</li>
              <li><strong>Password Security:</strong> Passwords are hashed using bcrypt with salt</li>
              <li><strong>Access Controls:</strong> Strict access controls and authentication for our systems</li>
              <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
              <li><strong>Monitoring:</strong> Continuous monitoring for unauthorized access</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@pixelperfectapi.net" className="text-blue-600 hover:underline">privacy@pixelperfectapi.net</a>
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws different from your jurisdiction. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our service may contain links to third-party websites or services that are not operated by us:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Stripe:</strong> Payment processing - see <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe Privacy Policy</a></li>
              <li><strong>Screenshot Targets:</strong> Websites you capture are not under our control</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* California Privacy Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. California Privacy Rights (CCPA)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of the sale of personal information (we do not sell your data)</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>

          {/* GDPR Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. European Privacy Rights (GDPR)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Right of access to your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
          </section>

          {/* Do Not Track */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Do Not Track Signals</h2>
            <p className="text-gray-700 leading-relaxed">
              Some browsers include a "Do Not Track" (DNT) feature. Our service does not currently respond to DNT signals because there is no standard interpretation of DNT signals. We will follow industry standards as they develop.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. For material changes, we will provide prominent notice or obtain consent as required by law.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:
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

          {/* Acknowledgment */}
          <section className="border-t pt-6">
            <p className="text-gray-600 text-sm leading-relaxed">
              By using PixelPerfect Screenshot API, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.
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

export default Privacy;