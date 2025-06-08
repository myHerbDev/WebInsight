export default function AcceptableUsePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 prose dark:prose-invert lg:prose-xl max-w-4xl">
      <h1>Acceptable Use Policy for WScrapierr</h1>
      <p className="lead">
        This Acceptable Use Policy ("AUP") outlines acceptable uses of the WScrapierr website and services
        (collectively, the "Service"). This policy is designed to protect the Service, our users, and the broader
        internet community from irresponsible or illegal activities. By using the Service, you agree to comply with this
        AUP.
      </p>

      <h2>1. Prohibited Uses</h2>
      <p>
        You may not use the Service to engage in, foster, or promote illegal, abusive, or irresponsible behavior,
        including but not limited to:
      </p>
      <ul>
        <li>
          <strong>Illegal Activities:</strong> Any use of the Service in violation of any applicable local, state,
          national, or international law or regulation. This includes, but is not limited to, unauthorized access to or
          use of data, systems, or networks.
        </li>
        <li>
          <strong>Harmful Content:</strong> Transmitting, distributing, or storing any material that is obscene,
          defamatory, libelous, threatening, harassing, hateful, or racially or ethnically offensive; or that
          constitutes child pornography or is otherwise harmful to minors.
        </li>
        <li>
          <strong>Intellectual Property Infringement:</strong> Infringing upon the intellectual property rights of
          others. This includes, but is not limited to, the unauthorized copying, distribution, or use of copyrighted
          material, trademarks, or trade secrets.
        </li>
        <li>
          <strong>Malicious Activity:</strong> Distributing malware, viruses, worms, Trojan horses, or other harmful
          software. Engaging in activities that disrupt or interfere with the Service or other users' ability to use the
          Service.
        </li>
        <li>
          <strong>Denial of Service (DoS) Attacks:</strong> Launching or facilitating DoS attacks against any target,
          including the Service itself.
        </li>
        <li>
          <strong>Unauthorized Scraping or Crawling:</strong> Using the Service to scrape, crawl, or otherwise access
          websites in a manner that violates their terms of service, robots.txt files, or puts an unreasonable load on
          their infrastructure. You are responsible for ensuring your use of WScrapierr is ethical and respects the
          target websites.
        </li>
        <li>
          <strong>Generating Harmful or Misleading AI Content:</strong> Using the AI content generation features to
          create content that is intentionally false, misleading, deceptive, or designed to spread disinformation, hate
          speech, or incite violence.
        </li>
        <li>
          <strong>Spamming:</strong> Sending unsolicited bulk messages or emails (spam).
        </li>
        <li>
          <strong>Account Misuse:</strong> Sharing your account credentials, or using an account without authorization.
          Attempting to gain unauthorized access to other user accounts or our systems.
        </li>
        <li>
          <strong>Resale of Service:</strong> Reselling or sublicensing the Service or any part thereof without our
          express written permission.
        </li>
      </ul>

      <h2>2. System and Network Security</h2>
      <p>
        You may not use the Service to violate the security or integrity of any network, computer or communications
        system, software application, or network or computing device (each, a "System"). Prohibited activities include:
      </p>
      <ul>
        <li>
          Accessing or using any System without permission, including attempting to probe, scan, or test the
          vulnerability of a System or to breach any security or authentication measures used by a System.
        </li>
        <li>Monitoring of data or traffic on a System without permission.</li>
        <li>Forging TCP-IP packet headers, e-mail headers, or any part of a message describing its origin or route.</li>
      </ul>

      <h2>3. Responsibility for Your Use</h2>
      <p>
        You are responsible for all activity originating from your account, including any misuse of the Service by your
        users or any third party. It is your responsibility to ensure that your use of the Service complies with this
        AUP and all applicable laws.
      </p>

      <h2>4. Enforcement and Violations</h2>
      <p>
        We reserve the right, but do not assume the obligation, to investigate any violation of this AUP or misuse of
        the Service. We may:
      </p>
      <ul>
        <li>Investigate violations of this AUP or misuse of the Service.</li>
        <li>
          Remove, disable access to, or modify any content or resource that violates this AUP or any other agreement we
          have with you for use of the Service.
        </li>
        <li>
          Report any activity that we suspect violates any law or regulation to appropriate law enforcement officials,
          regulators, or other appropriate third parties.
        </li>
        <li>Suspend or terminate your access to the Service for violations of this AUP.</li>
      </ul>
      <p>
        We may take any other action we deem appropriate to protect the Service, our users, and the internet community.
      </p>

      <h2>5. Reporting Violations</h2>
      <p>
        If you become aware of any violation of this AUP, you agree to notify us immediately. You can report violations
        through our <a href="/contact">contact page</a>.
      </p>

      <h2>6. Modifications to this AUP</h2>
      <p>
        We reserve the right to modify this AUP at any time by posting a revised version on our website. By continuing
        to use the Service after the effective date of any G_AUP_MODIFICATIONS, you agree to be bound by the
        G_AUP_MODIFICATIONS.
      </p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  )
}
