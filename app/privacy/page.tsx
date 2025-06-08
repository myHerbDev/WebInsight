export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 prose dark:prose-invert lg:prose-xl max-w-4xl">
      <h1>Privacy Policy for WScrapierr</h1>
      <p className="lead">
        Your privacy is important to us. This Privacy Policy explains how WScrapierr ("we", "us", or "our") collects,
        uses, discloses, and safeguards your information when you use our website and services (collectively, the
        "Service").
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        We may collect information about you in a variety of ways. The information we may collect via the Service
        includes:
      </p>
      <h3>a. Personal Data</h3>
      <p>
        Personally identifiable information, such as your name, email address, and payment information (if you subscribe
        to a paid plan), that you voluntarily give to us when you register with the Service or when you choose to
        participate in various activities related to the Service.
      </p>
      <h3>b. Derivative Data</h3>
      <p>
        Information our servers automatically collect when you access the Service, such as your IP address, your browser
        type, your operating system, your access times, and the pages you have viewed directly before and after
        accessing the Service.
      </p>
      <h3>c. Data from Website Analysis</h3>
      <p>
        When you use our service to analyze a website, we process the URL you provide and the publicly accessible data
        from that website. We may store the results of these analyses, which may include extracted text, metadata, and
        derived metrics. We do not claim ownership of the data from websites you analyze.
      </p>

      <h2>2. Use of Your Information</h2>
      <p>
        Having accurate information about you permits us to provide you with a smooth, efficient, and customized
        experience. Specifically, we may use information collected about you via the Service to:
      </p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Process your transactions and deliver the services you requested.</li>
        <li>Email you regarding your account or order.</li>
        <li>Improve our website and services.</li>
        <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
        <li>Notify you of updates to the Service.</li>
        <li>Respond to your comments, questions, and provide customer service.</li>
        <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
      </ul>

      <h2>3. Disclosure of Your Information</h2>
      <p>
        We may share information we have collected about you in certain situations. Your information may be disclosed as
        follows:
      </p>
      <h3>a. By Law or to Protect Rights</h3>
      <p>
        If we believe the release of information about you is necessary to respond to legal process, to investigate or
        remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may
        share your information as permitted or required by any applicable law, rule, or regulation.
      </p>
      <h3>b. Third-Party Service Providers</h3>
      <p>
        We may share your information with third parties that perform services for us or on our behalf, including
        payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
      </p>
      {/* Add more sections like Business Transfers, Affiliates etc. if applicable */}

      <h2>4. Security of Your Information</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information.
        While we have taken reasonable steps to secure the personal information you provide to us, please be aware that
        despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be
        guaranteed against any interception or other type of misuse.
      </p>

      <h2>5. Policy for Children</h2>
      <p>
        We do not knowingly solicit information from or market to children under the age of 13. If we learn that we have
        collected personal information from a child under age 13 without verification of parental consent, we will
        delete that information as quickly as possible.
      </p>

      <h2>6. Your Data Rights</h2>
      <p>Depending on your location, you may have the following rights regarding your personal data:</p>
      <ul>
        <li>The right to access – You have the right to request copies of your personal data.</li>
        <li>
          The right to rectification – You have the right to request that we correct any information you believe is
          inaccurate or complete information you believe is incomplete.
        </li>
        <li>
          The right to erasure – You have the right to request that we erase your personal data, under certain
          conditions.
        </li>
        {/* Add more rights like restriction of processing, data portability, object to processing */}
      </ul>
      <p>If you would like to exercise any of these rights, please contact us.</p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
        Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us through our{" "}
        <a href="/contact">contact page</a>.
      </p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  )
}
