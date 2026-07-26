import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import IconBadge from "../Components/IconBadge";
import { adminLogin } from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [staffIdValue, setStaffIdValue] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [errors, setErrors] = useState({ staffIdValue: "", pinValue: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {
      staffIdValue: staffIdValue.trim() ? "" : "Staff ID is required",
      pinValue: pinValue.trim() ? "" : "PIN is required",
    };

    setErrors(nextErrors);
    setApiError("");

    if (nextErrors.staffIdValue || nextErrors.pinValue) {
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(staffIdValue.trim(), pinValue);
      navigate("/admin");
    } catch (err) {
      setApiError(err.message || "Login failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Shell hideChrome>
      <div className="min-h-screen bg-surface-low flex items-center justify-center px-5 py-8">
        <Card className="w-full max-w-[28rem] px-5 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-soft">
              <LockKeyhole size={24} className="text-on-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-on-surface">Admin Console Access</h1>
              <p className="mt-2 text-sm text-on-surface-variant">
                Staff sign-in for SwitchGuard fraud monitoring and transaction review.
              </p>
            </div>
          </div>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">STAFF ID</span>
              <div className="relative">
                <UserRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type="text"
                  value={staffIdValue}
                  onChange={(event) => {
                    setStaffIdValue(event.target.value);
                    if (errors.staffIdValue) {
                      setErrors((current) => ({ ...current, staffIdValue: "" }));
                    }
                  }}
                  placeholder="Enter your staff ID"
                  aria-invalid={Boolean(errors.staffIdValue)}
                  aria-describedby={errors.staffIdValue ? "staff-id-error" : undefined}
                  className={`w-full h-12 rounded-md border bg-surface-lowest pl-11 pr-4 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                    errors.staffIdValue ? "border-error" : "border-outline-variant"
                  }`}
                />
              </div>
              {errors.staffIdValue && (
                <p id="staff-id-error" className="text-xs font-semibold text-error">
                  {errors.staffIdValue}
                </p>
              )}
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold tracking-[0.16em] text-on-surface-variant uppercase">PIN / Password</span>
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                <input
                  type={showPin ? "text" : "password"}
                  value={pinValue}
                  onChange={(event) => {
                    setPinValue(event.target.value);
                    if (errors.pinValue) {
                      setErrors((current) => ({ ...current, pinValue: "" }));
                    }
                  }}
                  placeholder="Enter your PIN"
                  aria-invalid={Boolean(errors.pinValue)}
                  aria-describedby={errors.pinValue ? "admin-pin-error" : undefined}
                  className={`w-full h-12 rounded-md border bg-surface-lowest pl-11 pr-12 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                    errors.pinValue ? "border-error" : "border-outline-variant"
                  }`}
                />
                <button
                  type="button"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                  onClick={() => setShowPin((current) => !current)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-lowest transition-colors"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.pinValue && (
                <p id="admin-pin-error" className="text-xs font-semibold text-error">
                  {errors.pinValue}
                </p>
              )}
            </label>

            <div className="flex items-center justify-between gap-4 pt-1">
              <span />
            </div>

            <Button type="submit" className="w-full uppercase tracking-[0.16em] justify-center" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>

            {apiError && (
              <p className="text-xs font-semibold text-error text-center mt-3">{apiError}</p>
            )}
          </form>

          <div className="my-6 h-px bg-outline-variant" />

          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-on-tertiary-container">
              <IconBadge icon={ShieldCheck} tone="success" size={28} />
              Authorized Bank System
            </div>
            <p className="text-sm italic text-on-surface-variant leading-6">
              Your security is our priority. Never share your PIN with anyone.
            </p>
          </div>
        </Card>
      </div>
    </Shell>
  );
}