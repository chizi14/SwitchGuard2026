import { useState, useEffect } from "react";
import { ShieldCheck, Check } from "lucide-react";

/**
 * Simulates an incoming SMS notification on a phone screen.
 * Used to demonstrate the "customer gets notified" step of a flow
 * without needing a real SMS gateway connected.
 */
export default function PhoneSmsPreview({ message, visible, time = "now" }) {
  const [delivered, setDelivered] = useState(false);

  useEffect(() => {
    if (!visible) {
      setDelivered(false);
      return;
    }
    const t = setTimeout(() => setDelivered(true), 900);
    return () => clearTimeout(t);
  }, [visible, message]);

  return (
    <div className="mx-auto w-56">
      <div className="bg-black rounded-2xl p-2.5 shadow-soft-hover">
        <div className="bg-gradient-to-b from-primary-container to-primary rounded-xl h-72 relative overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-3 text-[9px] text-white/70 font-mono">
            <span>9:41</span>
            <span>SwitchGuard · 4G</span>
          </div>
          <div className="flex flex-col items-center mt-10">
            <p className="text-white/50 text-[10px] font-mono">Lock Screen</p>
          </div>

          {/* Notification banner */}
          <div
            className={`absolute left-2 right-2 transition-all duration-500 ease-out ${
              visible ? "top-14 opacity-100" : "-top-24 opacity-0"
            }`}
          >
            <div className="bg-white/95 backdrop-blur rounded-xl p-3 shadow-lg">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <ShieldCheck size={13} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-bold text-on-surface">SwitchGuard</p>
                    <p className="text-[9px] text-on-surface-variant shrink-0">{time}</p>
                  </div>
                  <p className="text-[10.5px] text-on-surface leading-snug mt-0.5">{message}</p>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center justify-center gap-1.5 mt-2 transition-opacity duration-300 ${
                delivered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Check size={11} className="text-[#68dba9]" />
              <span className="text-[9px] font-semibold text-[#68dba9]">Delivered to customer's phone</span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-center text-[10px] text-on-surface-variant mt-2">
        Simulated SMS — shows what the customer receives on their phone
      </p>
    </div>
  );
}
