import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-outline-variant bg-surface px-5 lg:px-8 py-6 mt-auto">
      <div className="max-w-container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-on-surface">SwitchGuard</span>
          <span className="text-xs text-on-surface-variant">© 2026 SwitchGuard · FINOVATE Hackathon Prototype</span>
        </div>
        <div className="flex items-center gap-5 text-xs font-medium text-on-surface-variant">
          <Link to="/privacy-policy" className="hover:text-on-surface transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-on-surface transition-colors">Terms of Service</Link>
          <Link to="/help-center" className="hover:text-on-surface transition-colors">Help Center</Link>
        </div>
      </div>
    </footer>
  );
}
