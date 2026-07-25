import { ShieldAlert } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";

const sections = [
  {
    title: "Overview",
    body:
      "SwitchGuard is a prototype system that detects ATM dispense errors — cases where an account is debited but the ATM fails to release cash — and automatically reverses the affected transaction once verified.",
  },
  {
    title: "Prototype status",
    body:
      "This build was created for the FINOVATE 2026 National Virtual Hackathon and is not a live, deployed banking service. Transaction logs, account activity, and card data shown in this application are simulated for demonstration purposes.",
  },
  {
    title: "How reversal works",
    body:
      "A reversal only proceeds once three checks pass: the ATM's own log confirms a real dispense error, the transaction ID matches an actual record, and that transaction ID is confirmed to belong to the requesting account. No reversal is issued on a customer's claim alone.",
  },
  {
    title: "Acceptable use",
    body:
      "This prototype is intended for demonstration and evaluation purposes only, including by hackathon judges, organizers, and the development team. It should not be used to process real financial transactions.",
  },
  {
    title: "Limitation of liability",
    body:
      "As a hackathon prototype, SwitchGuard is provided as-is, without warranty of any kind, and is not liable for any reliance placed on it outside of its intended demonstration context.",
  },
];

export default function TermsOfService() {
  return (
    <Shell mobileTitle="Terms of Service">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Terms of Service</h1>
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
