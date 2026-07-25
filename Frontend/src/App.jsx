import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./Context/ThemeContext";
import { NotificationsProvider } from "./Context/NotificationsContext";
import Login from "./Pages/Login";
import CustomerDashboard from "./Pages/CustomerDashboard";
import BlockCard from "./Pages/BlockCard";
import SecurityAlert from "./Pages/SecurityAlert";
import ReversalDetail from "./Pages/ReversalDetail";
import PaymentApproval from "./Pages/PaymentApproval";
import AdminDashboard from "./Pages/AdminDashboard";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsOfService from "./Pages/TermsOfService";
import HelpCenter from "./Pages/HelpCenter";
import Settings from "./Pages/Settings";
import ReportIssue from "./Pages/ReportIssue";
import ContactSupport from "./Pages/ContactSupport";
import Profile from "./Pages/Profile";
import Notifications from "./Pages/Notifications";
import UssdDemo from "./Pages/UssdDemo";

export default function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
            <Route path="/security" element={<BlockCard />} />
            <Route path="/security/alert" element={<SecurityAlert />} />
            <Route path="/activity" element={<ReversalDetail />} />
            <Route path="/payment-approval" element={<PaymentApproval />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/report-issue" element={<ReportIssue />} />
            <Route path="/contact-support" element={<ContactSupport />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/ussd-demo" element={<UssdDemo />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </ThemeProvider>
  );
}
