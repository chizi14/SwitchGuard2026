import { useState } from "react";
import { Phone, RotateCcw, Info } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";


const ussdShortcode = "*384*46#";

const ussdMenu = {
  root: { text: "SwitchGuard\n1. Check balance\n2. Report failed withdrawal\n3. Block my card\n4. Recent alerts\n0. Exit", options: { "1": "balance", "2": "report-start", "3": "block-confirm", "4": "alerts", "0": "exit" } },
  balance: { text: "Account balance:\nMWK 45,280.64\n\n0. Back to menu\n00. Exit", options: { "0": "root", "00": "exit" } },
  "report-start": { text: "Report failed withdrawal\nEnter the amount you were charged but not given, e.g. 50000\n\n0. Back", options: { "0": "root" }, isInput: true, next: "report-confirm" },
  "report-confirm": { text: "We found a matching ATM error for MWK 50,000.\n\n1. Confirm and reverse\n0. Back to menu", options: { "1": "report-done", "0": "root" } },
  "report-done": { text: "Reversal started.\nMWK 50,000 will be credited within 10 minutes.\nSMS confirmation will follow.\n\n0. Back to menu\n00. Exit", options: { "0": "root", "00": "exit" } },
  "block-confirm": { text: "Block your card ending 4242?\n1. Yes, block it\n2. No, go back", options: { "1": "block-done", "2": "root" } },
  "block-done": { text: "Your card ending 4242 is now blocked.\nSMS confirmation sent.\n\n0. Back to menu\n00. Exit", options: { "0": "root", "00": "exit" } },
  alerts: { text: "Recent alerts:\n1. Withdrawal flagged in Lilongwe\n2. Card blocked (self-requested)\n\n0. Back to menu", options: { "1": "root", "2": "root", "0": "root" } },
  exit: { text: "Session ended. Dial *384*46# any time to check your account.", options: {} },
};

export default function UssdDemo() {
  const [started, setStarted] = useState(false);
  const [screenKey, setScreenKey] = useState("root");
  const [inputValue, setInputValue] = useState("");
  const [awaitingInput, setAwaitingInput] = useState(false);

  const screen = ussdMenu[screenKey];

  const dial = () => {
    setStarted(true);
    setScreenKey("root");
    setAwaitingInput(false);
  };

  const reset = () => {
    setStarted(false);
    setScreenKey("root");
    setInputValue("");
    setAwaitingInput(false);
  };

  const selectOption = (key) => {
    const next = screen.options[key];
    if (!next) return;
    const nextScreen = ussdMenu[next];
    setScreenKey(next);
    if (nextScreen?.isInput) {
      setAwaitingInput(true);
    } else {
      setAwaitingInput(false);
    }
  };

  const submitInput = () => {
    if (!inputValue.trim()) return;
    setScreenKey(screen.next);
    setAwaitingInput(false);
    setInputValue("");
  };

  return (
    <Shell mobileTitle="USSD Demo">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface mb-2">USSD Demo</h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            SwitchGuard works on any phone, not just smartphones — dial{" "}
            <span className="font-mono font-semibold text-on-surface">{ussdShortcode}</span> from
            any basic feature phone to check balance, report a failed withdrawal, or block a card,
            no internet or app required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Phone mockup */}
          <div className="mx-auto">
            <div className="w-72 bg-primary rounded-xl p-4 shadow-soft-hover">
              <div className="bg-black rounded-md p-4 min-h-[280px] flex flex-col">
                <div className="flex items-center justify-between text-[10px] text-[#68dba9] mb-3 font-mono">
                  <span>SwitchGuard</span>
                  <span>Signal ●●●●</span>
                </div>
                <div className="flex-1 font-mono text-sm text-[#68dba9] whitespace-pre-wrap leading-relaxed">
                  {!started ? (
                    <span className="text-[#68dba9]/70">Enter USSD code to begin…</span>
                  ) : (
                    screen.text
                  )}
                </div>
              </div>

              {/* Simple keypad, only used for the "enter amount" input step */}
              {started && awaitingInput && (
                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full h-10 px-3 rounded bg-black text-[#68dba9] font-mono text-sm border border-tertiary-container focus:outline-none"
                  />
                  <button
                    onClick={submitInput}
                    className="w-full h-10 rounded bg-secondary text-on-secondary text-sm font-semibold"
                  >
                    Send
                  </button>
                </div>
              )}

              {started && !awaitingInput && Object.keys(screen.options).length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {Object.keys(screen.options).map((key) => (
                    <button
                      key={key}
                      onClick={() => selectOption(key)}
                      className="h-10 rounded bg-white/10 text-white font-mono text-sm font-semibold hover:bg-white/20 transition-colors"
                    >
                      {key}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3 flex gap-2">
                {!started ? (
                  <button
                    onClick={dial}
                    className="flex-1 h-11 rounded-full bg-secondary text-on-secondary font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Phone size={15} />
                    Dial {ussdShortcode}
                  </button>
                ) : (
                  <button
                    onClick={reset}
                    className="flex-1 h-11 rounded-full bg-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                  >
                    <RotateCcw size={15} />
                    End session
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Explanation panel */}
          <div className="space-y-4">
            <Card className="flex items-start gap-3">
              <Info size={18} className="text-secondary shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This simulates a real USSD session. In production, this would run on a shortcode
                registered with a telecom aggregator — Africa's Talking already supports USSD in
                Malawi and is the same platform being evaluated for SMS. Getting a live shortcode
                requires business registration and approval, so this demo simulates that exact
                session instead.
              </p>
            </Card>
            <Card>
              <h3 className="font-bold text-on-surface text-sm mb-3">Try it</h3>
              <ol className="text-sm text-on-surface-variant space-y-2 list-decimal list-inside leading-relaxed">
                <li>Tap "Dial {ussdShortcode}" to start a session</li>
                <li>Choose option 2 to report a failed withdrawal</li>
                <li>Enter an amount and send</li>
                <li>Confirm the match — same detection logic as the app, on any phone</li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
