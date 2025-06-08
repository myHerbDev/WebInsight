export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 prose dark:prose-invert lg:prose-xl max-w-4xl">
      <h1>Cookie Policy for WScrapierr</h1>
      <p className="lead">
        This Cookie Policy explains how WScrapierr ("we", "us", or "our") uses cookies and similar technologies to
        recognize you when you visit our website and use our services (collectively, the "Service"). It explains what
        these technologies are and why we use them, as well as your rights to control our use of them.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies
        are widely used by website owners in order to make their websites work, or to work more efficiently, as well as
        to provide reporting information.
      </p>
      <p>
        Cookies set by the website owner (in this case, WScrapierr) are called "first-party cookies". Cookies set by
        parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party
        features or functionality to be provided on or through the website (e.g., like advertising, interactive content,
        and analytics). The parties that set these third-party cookies can recognize your computer both when it visits
        the website in question and also when it visits certain other websites.
      </p>

      <h2>2. Why Do We Use Cookies?</h2>
      <p>
        We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons
        in order for our Service to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other
        cookies also enable us to track and target the interests of our users to enhance the experience on our Service.
        Third parties serve cookies through our Service for analytics and other purposes. This is described in more
        detail below.
      </p>

      <h2>3. Types of Cookies We Use</h2>
      <h3>a. Essential Website Cookies</h3>
      <p>
        These cookies are strictly necessary to provide you with services available through our Service and to use some
        of its features, such as access to secure areas (e.g., your user account).
      </p>
      <h3>b. Performance and Functionality Cookies</h3>
      <p>
        These cookies are used to enhance the performance and functionality of our Service but are non-essential to
        their use. However, without these cookies, certain functionality (like remembering your login details or
        preferences) may become unavailable.
      </p>
      <h3>c. Analytics and Customization Cookies</h3>
      <p>
        These cookies collect information that is used either in aggregate form to help us understand how our Service is
        being used or how effective our marketing campaigns are, or to help us customize our Service for you. For
        example, we may use Google Analytics.
      </p>
      {/* <h3>d. Advertising Cookies (If Applicable)</h3>
      <p>
        These cookies are used to make advertising messages more relevant to you. They perform functions like preventing
        the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some
        cases selecting advertisements that are based on your interests.
      </p> */}

      <h2>4. How Can You Control Cookies?</h2>
      <p>
        You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by
        setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you
        may still use our website though your access to some functionality and areas of our website may be restricted.
      </p>
      <p>
        Most browsers allow you to control cookies through their settings preferences. For more information on how to
        manage and delete cookies, visit{" "}
        <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
          allaboutcookies.org
        </a>
        .
      </p>
      {/* Add info about specific third-party opt-outs if relevant, e.g., Google Analytics Opt-out Browser Add-on */}

      <h2>5. Changes to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we
        use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy
        regularly to stay informed about our use of cookies and related technologies.
      </p>

      <h2>6. Where Can You Get Further Information?</h2>
      <p>
        If you have any questions about our use of cookies or other technologies, please contact us through our{" "}
        <a href="/contact">contact page</a>.
      </p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </div>
  )
}
