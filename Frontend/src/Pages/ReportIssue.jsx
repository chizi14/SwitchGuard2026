import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import Shell from "../Components/Shell";
import Card from "../Components/Card";
import Button from "../Components/Button";
import { reportIssue } from "../api";

const categories = ["Incorrect reversal amount", "Reversal not received", "Wrong transaction flagged", "Something else"];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [category, setCategory] = useState(categories[0]);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState("");
  const reversalDetail = { transactionId: location?.state?.txId || "TXN-882944012" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await reportIssue(reversalDetail.transactionId, category, details);
      setRefId(result.referenceId);
      setSubmitted(true);
    } catch (err) {
      alert(err.message);
    }
  };

  if (submitted) {
    return (
      <Shell mobileTitle="Report Issue">
        <div className="max-w-lg mx-auto">
          <Card className="flex flex-col items-center text-center py-14">
            <div className="w-16 h-16 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-4">
              <CheckCircle2 size={30} className="text-on-tertiary-container" />
            </div>
            <h3 className="font-bold text-lg text-on-surface mb-1.5">Report submitted</h3>
            <p className="text-sm text-on-surface-variant max-w-sm">
              Reference #{refId || reversalDetail.transactionId + "-RPT"}. Our team will review this and follow
              up by SMS within 24 hours.
            </p>
            <Button variant="primary" className="mt-6" onClick={() => navigate("/activity")}>
              Back to transaction
            </Button>
          </Card>
        </div>
      </Shell>
    );
  }

  return (
    <Shell mobileTitle="Report Issue">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-2xl font-bold text-on-surface mb-1">Report an issue</h1>
        <p className="text-sm text-on-surface-variant mb-6">
          Regarding transaction <span className="font-mono font-semibold">{reversalDetail.transactionId}</span>
        </p>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-2">What's wrong?</label>
              <div className="space-y-2">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-4 py-3 rounded border-2 text-sm font-medium transition-colors min-h-[48px] ${
                      category === c
                        ? "border-primary bg-primary-container/5 text-on-surface"
                        : "border-outline-variant text-on-surface-variant hover:border-outline"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="details" className="block text-sm font-semibold text-on-surface mb-2">
                Additional details
              </label>
              <textarea
                id="details"
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell us more about what happened…"
                className="w-full p-4 rounded border border-outline-variant text-sm placeholder:text-outline focus:outline-none focus:border-2 focus:border-primary transition-all resize-none bg-surface-lowest text-on-surface"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Submit report
            </Button>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
