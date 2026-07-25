import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, MessageCircle, Mail } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";

const faqs = [
  {
    q: "What is a dispense error?",
    a: "A dispense error happens when an ATM deducts money from your account but fails to physically release the cash — usually due to a machine or mechanical fault, not something you did wrong.",
  },
  {
    q: "How does SwitchGuard fix it automatically?",
    a: "SwitchGuard checks three things: the ATM's own log confirms a real dispense error, the transaction ID matches a real record, and that ID belongs to your account. Once all three are confirmed, funds are reversed — usually within 2 to 10 minutes.",
  },
  {
    q: "Can I trigger a reversal manually?",
    a: "Yes. If SwitchGuard's automatic detection ever misses something, you can submit the transaction ID yourself as a backup. The same three checks still apply before anything is reversed.",
  },
  {
    q: "What happens if I block my card by mistake?",
    a: "No problem — go to the Security page and unblock it any time. It takes effect immediately, no branch visit or waiting required.",
  },
  {
    q: "What should I do if I get a suspicious activity alert?",
    a: "Review the transaction details shown. If it was really you, select \"This was me.\" If you don't recognize it, select \"Not me — secure account\" to freeze your card immediately while it's investigated.",
  },
  {
    q: "Is this system live with my real bank account?",
    a: "No. This is a prototype built for the FINOVATE 2026 hackathon. All transaction and account data shown is simulated for demonstration purposes.",
  },
];

export default function HelpCenter() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Shell mobileTitle="Help Center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">Help Center</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Answers to common questions about SwitchGuard.
        </p>

        <div className="space-y-3 mb-8">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <Card key={item.q} padded={false} className="overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left p-5"
                >
                  <span className="font-semibold text-on-surface text-sm">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-on-surface-variant transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <p className="text-sm text-on-surface-variant leading-relaxed px-5 pb-5 -mt-2">
                    {item.a}
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-primary text-white">
          <div>
            <p className="font-bold">Still need help?</p>
            <p className="text-sm text-white/70 mt-0.5">Our team is here for anything not covered above.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <a
              href="mailto:uchizi2k@gmail.com"
              className="inline-flex items-center justify-center gap-2 h-12 px-5 rounded font-semibold text-sm !bg-white/10 !text-white border border-white/20 hover:!bg-white/20 transition-colors"
            >
              <Mail size={18} strokeWidth={2.25} />
              Email us
            </a>
            <Button variant="secondary" icon={MessageCircle} onClick={() => navigate("/contact-support")}>
              Contact support
            </Button>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
