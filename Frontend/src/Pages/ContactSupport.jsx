import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Clock } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import IconBadge from "../Components/IconBadge";

const channels = [
  {
    icon: Phone,
    title: "Call security support",
    detail: "+265 1 820 622 — available 24/7 for card and reversal issues",
    href: "tel:+2651820622",
    cta: "Call now",
  },
  {
    icon: Mail,
    title: "Email the team",
    detail: "uchizi2k@gmail.com — typical reply within a few hours",
    href: "mailto:uchizi2k@gmail.com",
    cta: "Send email",
  },
];

export default function ContactSupport() {
  const navigate = useNavigate();

  return (
    <Shell mobileTitle="Contact Support">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-on-surface mb-1">Contact support</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Choose the option that works best for you.
        </p>

        <div className="space-y-4">
          {channels.map((c) => (
            <Card key={c.title} className="flex items-center gap-4">
              <IconBadge icon={c.icon} tone="primary" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface">{c.title}</p>
                <p className="text-sm text-on-surface-variant mt-0.5">{c.detail}</p>
              </div>
              <a
                href={c.href}
                className="shrink-0 inline-flex items-center h-10 px-4 rounded font-semibold text-sm bg-primary text-white hover:bg-black transition-colors"
              >
                {c.cta}
              </a>
            </Card>
          ))}
        </div>

        <Card className="flex items-start gap-3 mt-4 bg-surface-container">
          <Clock size={18} className="text-on-surface-variant shrink-0 mt-0.5" />
          <p className="text-xs text-on-surface-variant leading-relaxed">
            For lost or stolen cards, use the Security page to block your card immediately —
            don't wait for a support reply. Blocking takes effect right away.
          </p>
        </Card>
      </div>
    </Shell>
  );
}
