import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck, UserCheck, RotateCcw, MessageSquare, Download, FileWarning, MessageCircle, PlayCircle, Loader2 } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import PhoneSmsPreview from "../Components/PhoneSmsPreview";
import { reversalDetail, currency, customer } from "../Data/mockData";

const iconFor = {
  deducted: CheckCircle2,
  error: AlertCircle,
  "id-match": ShieldCheck,
  ownership: UserCheck,
  reversed: RotateCcw,
  sms: MessageSquare,
};

const STEP_DELAY_MS = 900;

function downloadReceiptImage(detail) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#F8F9FA";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Header band
  ctx.fillStyle = "#000519";
  ctx.fillRect(0, 0, canvas.width, 160);
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 34px Arial";
  ctx.fillText("SwitchGuard", 40, 70);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#C5CBE0";
  ctx.fillText("ATM Transaction Receipt", 40, 100);
  ctx.fillStyle = "#FFCE51";
  ctx.font = "bold 15px Arial";
  ctx.fillText("REVERSAL SUCCESSFUL", 40, 135);

  // Body rows
  const rows = [
    ["Transaction ID", detail.transactionId],
    ["ATM Location", detail.atmLocation],
    ["Amount", currency(detail.amount)],
    ["Original Timestamp", detail.originalTimestamp],
    ["Reversed On", detail.reversedOn],
  ];
  let y = 230;
  ctx.font = "14px Arial";
  rows.forEach(([label, value]) => {
    ctx.fillStyle = "#44464F";
    ctx.font = "13px Arial";
    ctx.fillText(label.toUpperCase(), 40, y);
    ctx.fillStyle = "#191C1D";
    ctx.font = "bold 20px Arial";
    ctx.fillText(String(value), 40, y + 28);
    ctx.strokeStyle = "#E1E3E4";
    ctx.beginPath();
    ctx.moveTo(40, y + 50);
    ctx.lineTo(680, y + 50);
    ctx.stroke();
    y += 90;
  });

  // Timeline
  ctx.fillStyle = "#191C1D";
  ctx.font = "bold 18px Arial";
  ctx.fillText("Process Timeline", 40, y + 20);
  y += 55;
  detail.timeline.forEach((step) => {
    ctx.fillStyle = "#0E996B";
    ctx.beginPath();
    ctx.arc(50, y - 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#191C1D";
    ctx.font = "bold 14px Arial";
    ctx.fillText(step.title, 70, y);
    ctx.fillStyle = "#44464F";
    ctx.font = "12px Arial";
    ctx.fillText(step.time, 620, y);
    y += 32;
  });

  // Footer
  ctx.fillStyle = "#8A8D97";
  ctx.font = "11px Arial";
  ctx.fillText("FINOVATE 2026 Hackathon Prototype — Simulated Receipt", 40, canvas.height - 30);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `switchguard-receipt-${detail.transactionId}.png`;
    link.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function ReversalDetail() {
  const navigate = useNavigate();
  const totalSteps = reversalDetail.timeline.length;
  const [visibleSteps, setVisibleSteps] = useState(totalSteps); // static: all shown by default
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const runSimulation = () => {
    clearTimeout(timeoutRef.current);
    setIsPlaying(true);
    setVisibleSteps(0);

    const revealNext = (i) => {
      setVisibleSteps(i);
      if (i < totalSteps) {
        timeoutRef.current = setTimeout(() => revealNext(i + 1), STEP_DELAY_MS);
      } else {
        setIsPlaying(false);
      }
    };
    timeoutRef.current = setTimeout(() => revealNext(1), STEP_DELAY_MS);
  };

  const complete = visibleSteps >= totalSteps;

  return (
    <Shell mobileTitle="Activity" showSearch>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={isPlaying ? Loader2 : PlayCircle}
            onClick={runSimulation}
            disabled={isPlaying}
            className={isPlaying ? "[&_svg]:animate-spin" : ""}
          >
            {isPlaying ? "Simulating…" : "Replay live simulation"}
          </Button>
          {complete ? (
            <span className="inline-flex items-center gap-1.5 bg-tertiary-container/20 text-on-tertiary-container text-xs font-bold px-3 py-1.5 rounded-full">
              <CheckCircle2 size={13} />
              Reversal successful
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-secondary-container/40 text-on-secondary-container text-xs font-bold px-3 py-1.5 rounded-full">
              <Loader2 size={13} className="animate-spin" />
              In progress…
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Transaction summary */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-bold text-lg text-on-surface">ATM Transaction</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Reversed on {reversalDetail.reversedOn}</p>
              </div>
              <div className="w-11 h-11 rounded bg-surface-container flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                ATM
              </div>
            </div>

            <dl className="space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Transaction ID</dt>
                <dd className="font-mono text-sm font-bold text-on-surface">{reversalDetail.transactionId}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">ATM location</dt>
                <dd className="text-sm font-semibold text-on-surface text-right">{reversalDetail.atmLocation}</dd>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant pb-3">
                <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Amount</dt>
                <dd className="text-xl font-bold text-on-surface">{currency(reversalDetail.amount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Original timestamp</dt>
                <dd className="text-sm font-semibold text-on-surface">{reversalDetail.originalTimestamp}</dd>
              </div>
            </dl>

            <Button variant="primary" icon={Download} className="w-full mt-6" onClick={() => downloadReceiptImage(reversalDetail)}>
              Download receipt
            </Button>
          </Card>

          <Card className="bg-secondary-container/15 flex items-start gap-3">
            <ShieldCheck size={18} className="text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-on-surface">SwitchGuard protection</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                This reversal was triggered automatically after the ATM's own log reported a
                dispensing failure — and only after the transaction ID was matched and confirmed
                to belong to this account. No manual dispute was needed.
              </p>
            </div>
          </Card>

          <Card>
            <p className="text-sm font-bold text-on-surface mb-4 text-center">What the customer receives</p>
            <PhoneSmsPreview
              visible={complete}
              time={complete ? reversalDetail.timeline[totalSteps - 1].time : ""}
              message={`SwitchGuard: ${currency(reversalDetail.amount)} has been returned to your account ending ${customer.accountNumber.slice(-4)}. Ref ${reversalDetail.transactionId}.`}
            />
          </Card>
        </div>

        {/* Timeline */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-on-surface">Process timeline</h3>
            {isPlaying && (
              <span className="text-xs font-semibold text-on-surface-variant">
                Step {visibleSteps} of {totalSteps}
              </span>
            )}
          </div>
          <ol className="relative">
            {reversalDetail.timeline.slice(0, visibleSteps).map((step, i) => {
              const Icon = iconFor[step.key];
              const isLast = i === visibleSteps - 1;
              const isFinalOverall = i === totalSteps - 1;
              return (
                <li
                  key={step.key}
                  className={`relative pl-14 pb-8 last:pb-0 ${isPlaying ? "animate-[fadeIn_0.4s_ease]" : ""}`}
                >
                  {!isFinalOverall && (
                    <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-tertiary-container" />
                  )}
                  <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                    <Icon size={18} className="text-on-tertiary-container" />
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-on-surface">{step.title}</p>
                    <span className="text-xs text-on-surface-variant font-mono shrink-0">{step.time}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">{step.detail}</p>
                </li>
              );
            })}
            {isPlaying && visibleSteps < totalSteps && (
              <li className="relative pl-14">
                <span className="absolute left-0 top-0 w-10 h-10 rounded-full bg-surface-highest flex items-center justify-center">
                  <Loader2 size={16} className="text-on-surface-variant animate-spin" />
                </span>
                <p className="text-sm text-on-surface-variant pt-2">Checking next step…</p>
              </li>
            )}
          </ol>
        </Card>
      </div>

      {/* Still need help */}
      <Card className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-highest">
        <div>
          <p className="font-bold text-on-surface">Still need help?</p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            If you have questions about this reversal or the original transaction.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" icon={FileWarning} onClick={() => navigate("/report-issue")}>Report issue</Button>
          <Button variant="secondary" icon={MessageCircle} onClick={() => navigate("/contact-support")}>Contact support</Button>
        </div>
      </Card>
    </Shell>
  );
}
