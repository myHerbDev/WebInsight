export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 prose dark:prose-invert lg:prose-xl max-w-4xl">
      <h1>Terms of Service for WScrapierr</h1>
      <p className="lead">
        Welcome to WScrapierr! These Terms of Service ("Terms") govern your use of the WScrapierr website and services
        (collectively, the "Service") operated by WScrapierr ("us", "we", or "our").
      </p>
      <p>
        Please read these Terms carefully before accessing or using our Service. By accessing or using any part of the
        Service, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this
        agreement, then you may not access the Service.
      </p>

      <h2>1. Accounts</h2>
      <p>
        When you create an account with us, you must provide us information that is accurate, complete, and current at
        all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your
        account on our Service.
      </p>
      <p>
        You are responsible for safeguarding the password that you use to access the Service and for any activities or
        actions under your password, whether your password is with our Service or a third-party service.
      </p>
      <p>
        You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware
        of any breach of security or unauthorized use of your account.
      </p>

      <h2>2. Use of the Service</h2>
      <p>
        WScrapierr provides tools for website analysis and AI-powered content generation. You agree to use the Service
        in compliance with all applicable local, state, national, and international laws, rules, and regulations.
      </p>
      <p>You agree not to use the Service:</p>
      <ul>
        <li>In any way that violates any applicable national or international law or regulation.</li>
        <li>
          For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to
          inappropriate content or otherwise.
        </li>
        <li>
          To engage in any activity that interferes with or disrupts the Service (or the servers and networks which are
          connected to the Service).
        </li>
        <li>
          To scrape or analyze websites for which you do not have permission, or in a manner that violates the terms of
          service of those websites. WScrapierr is a tool, and you are responsible for its ethical and legal use.
        </li>
        <li>To generate content that is unlawful, defamatory, obscene, fraudulent, or otherwise objectionable.</li>
      </ul>
      <p>
        We reserve the right to terminate or suspend your access to our Service immediately, without prior notice or
        liability, for any reason whatsoever, including without limitation if you breach the Terms.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        The Service and its original content (excluding content provided by users or data from third-party websites),
        features, and functionality are and will remain the exclusive property of WScrapierr and its licensors. The
        Service is protected by copyright, trademark, and other laws of both [Your Country/Jurisdiction] and foreign
        countries.
      </p>
      <p>
        Data extracted from third-party websites remains the property of their respective owners. WScrapierr does not
        claim ownership of such data. You are responsible for ensuring you have the right to access and use data from
        any website you analyze.
      </p>

      <h2>4. Subscription and Payment (If Applicable)</h2>
      <p>
        Some parts of the Service may be billed on a subscription basis ("Subscription(s)"). You will be billed in
        advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or
        annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
      </p>
      {/* Add more details on renewals, fee changes, refunds if applicable */}

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event shall WScrapierr, nor its directors, employees, partners, agents, suppliers, or affiliates, be
        liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
        loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or
        inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any
        content obtained from the Service or from third-party websites analyzed through the Service; and (iv)
        unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract,
        tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility
        of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
      </p>

      <h2>6. Disclaimer</h2>
      <p>
        Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
        The Service is provided without warranties of any kind, whether express or implied, including, but not limited
        to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of
        performance.
      </p>
      <p>
        WScrapierr its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function
        uninterrupted, secure or available at any particular time or location; b) any errors or defects will be
        corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service
        will meet your requirements or expectations. Information obtained from website analysis is based on publicly
        available data and automated processes, and may not always be accurate, complete, or up-to-date.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms shall be governed and construed in accordance with the laws of [Your Country/Jurisdiction], without
        regard to its conflict of law provisions.
      </p>

      <h2>8. Changes</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is
        material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes
        a material change will be determined at our sole discretion.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us through our <a href="/contact">contact page</a>.
      </p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  )
}
