import { ShieldAlert } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";

const sections = [
  {
    title: "What we collect",
    body:
      "To demonstrate dispense-error detection and reversal, SwitchGuard works with transaction data such as ATM transaction IDs, timestamps, amounts, and account identifiers. In this prototype, this data is simulated, not pulled from a real bank system.",
  },
  {
    title: "How we use it",
    body:
      "Transaction data is used only to detect dispense errors, verify that a transaction ID belongs to the right account, and process the resulting reversal. Contact details (like phone numbers) are used only to send confirmation SMS messages for reversals, card blocks, and payment approvals.",
  },
  {
    title: "Data sharing",
    body:
      "SwitchGuard does not sell or share customer data with third parties. In a real deployment, data would only be shared with the bank systems and messaging providers strictly necessary to operate the service, under the bank's own data protection obligations.",
  },
  {
    title: "Security",
    body:
      "A production version of SwitchGuard would apply bank-grade security controls end to end. As a hackathon prototype, this build focuses on demonstrating the detection and reversal logic rather than implementing production security infrastructure.",
  },
];

export default function PrivacyPolicy() {
  return (
    <Shell mobileTitle="Privacy Policy">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Privacy Policy</h1>
        <p className="text-sm text-on-surface-variant mb-6">Last updated July 2026</p>

        <Card className="flex items-start gap-3 bg-secondary-container/20 mb-6">
          <ShieldAlert size={18} className="text-secondary shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            This is placeholder content for the FINOVATE 2026 hackathon prototype. It is not a
            reviewed legal document and does not reflect an actual National Bank of Malawi policy.
          </p>
        </Card>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-bold text-on-surface mb-2">{s.title}</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
