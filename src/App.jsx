
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Account from "./pages/Account";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundCancellation from "./pages/Refund";
import DataSecurity from "./pages/DataSecurity";
import AuthorisedDealers from "./pages/AuthorisedDealers"; 
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGate from "./pages/admin/AdminGate";
import OverviewPage from "./pages/admin/OverviewPage";
import BookingsPage from "./pages/admin/BookingsPage";
import ServicesPage from "./pages/admin/ServicesPage";
import ProfessionalsPage from "./pages/admin/ProfessionalsPage";
import CustomersPage from "./pages/admin/CustomersPage";
import ContactInboxPage from "./pages/admin/ContactInboxPage";
import SupportTicketsPage from "./pages/admin/SupportTicketsPage";
import ServiceAreasPage from "./pages/admin/ServiceAreasPage";
import NewsletterPage from "./pages/admin/NewsletterPage";
import AdminProfilesPage from "./pages/admin/AdminProfilesPage";
import TeamAccessPage from "./pages/admin/TeamAccessPage";
import AdminSectionGate from "./pages/admin/AdminSectionGate";

import FAQ from "./components/FAQ";

export default function App() {
  return (
    <>
      {/* Scroll to top on every route change */}
      <ScrollToTop />

      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminGate><AdminDashboard /></AdminGate>}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<AdminSectionGate section="overview"><OverviewPage /></AdminSectionGate>} />
          <Route path="bookings" element={<AdminSectionGate section="bookings"><BookingsPage /></AdminSectionGate>} />
          <Route path="services" element={<AdminSectionGate section="services"><ServicesPage /></AdminSectionGate>} />
          <Route path="professionals" element={<AdminSectionGate section="professionals"><ProfessionalsPage /></AdminSectionGate>} />
          <Route path="customers" element={<AdminSectionGate section="customers"><CustomersPage /></AdminSectionGate>} />
          <Route path="contact" element={<AdminSectionGate section="contact"><ContactInboxPage /></AdminSectionGate>} />
          <Route path="tickets" element={<AdminSectionGate section="tickets"><SupportTicketsPage /></AdminSectionGate>} />
          <Route path="service-areas" element={<AdminSectionGate section="service-areas"><ServiceAreasPage /></AdminSectionGate>} />
          <Route path="newsletter" element={<AdminSectionGate section="newsletter"><NewsletterPage /></AdminSectionGate>} />
          <Route path="profiles" element={<AdminProfilesPage />} />
          <Route path="team" element={<TeamAccessPage />} />
          <Route path="*" element={<Navigate to="/admin/overview" replace />} />
        </Route>
        {/* Older admin account links pointed here; keep them from rendering a blank route. */}
        <Route path="/account/admin" element={<Navigate to="/admin" replace />} />
        <Route element={<Layout />}>
          {/* Main Pages */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />

          {/* FAQ Page */}
          <Route path="/faq" element={<FAQ />} />

          {/* Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<RefundCancellation />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/data" element={<DataSecurity />} />
          <Route path="/dealer" element={<AuthorisedDealers />} />
        </Route>
      </Routes>
    </>
  );
}
