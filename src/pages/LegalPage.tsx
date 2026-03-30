import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LegalPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0f0a] via-[#2d1810] to-[#1a0f0a] text-white pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Privacy Policy & End-User License Agreement (EULA)</CardTitle>
            <CardDescription className="text-white/70">CoffeeGuard • Last updated: March 31, 2026</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-white/90 leading-relaxed">
            <p>
              This page explains how CoffeeGuard collects and uses data, and the terms that apply when you use the
              platform. By creating an account or continuing to use CoffeeGuard, you agree to this Privacy Policy and
              EULA.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-white/90 leading-relaxed">
            <section className="space-y-2">
              <h3 className="font-semibold text-white">1. Data We Collect</h3>
              <p>
                We may collect account information (name, email), uploaded images for diagnosis, diagnosis outputs,
                usage logs, language preferences, and technical metadata (device/browser information, IP-derived
                location region, and timestamps).
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">2. Why We Process Data</h3>
              <p>
                We process data to provide disease diagnosis features, improve model quality, maintain security,
                support users, and monitor system performance. Research use is limited to improvement and quality
                assurance purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">3. Data Sharing and Access</h3>
              <p>
                CoffeeGuard does not sell personal data. Access is restricted to authorized personnel and service
                providers who need data to operate the platform. Data may be shared when required by law or to protect
                users and the service.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">4. Retention and Deletion</h3>
              <p>
                We keep data only as long as needed for operational, legal, and research-quality obligations.
                Users may request deletion of account-linked data, subject to lawful retention requirements.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">5. User Rights</h3>
              <p>
                You can request access, correction, or deletion of your personal data, and object to certain processing
                where applicable. Contact the project team through official channels in your course submission.
              </p>
            </section>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle>End-User License Agreement (EULA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm md:text-base text-white/90 leading-relaxed">
            <section className="space-y-2">
              <h3 className="font-semibold text-white">1. License Grant</h3>
              <p>
                CoffeeGuard grants you a limited, non-exclusive, non-transferable, revocable license to access and use
                the platform for educational and agricultural support purposes.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">2. Acceptable Use</h3>
              <p>
                You agree not to misuse the service, attempt unauthorized access, upload harmful content, disrupt
                system operations, or use outputs to make unsafe high-stakes decisions without professional judgment.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">3. No Medical or Guaranteed Outcomes</h3>
              <p>
                Diagnosis results are decision-support outputs and may contain errors. CoffeeGuard does not guarantee
                complete accuracy and does not replace agronomy experts, extension officers, or laboratory testing.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">4. Intellectual Property</h3>
              <p>
                The application design, models, and supporting content remain the property of the project team or
                rightful licensors. You may not copy, reverse engineer, or redistribute protected components without
                permission.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold text-white">5. Limitation of Liability and Changes</h3>
              <p>
                To the extent allowed by law, CoffeeGuard is not liable for indirect or consequential losses from use
                of the platform. We may update these terms; continued use after updates means you accept revised terms.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default LegalPage;