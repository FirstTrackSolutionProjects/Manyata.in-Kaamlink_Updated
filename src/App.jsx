
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import RefundCancellation from "./pages/Refund";
import DataSecurity from "./pages/DataSecurity";
import AuthorisedDealers from "./pages/AuthorisedDealers"; 

import FAQ from "./components/FAQ";

export default function App() {
  return (
    <>
      {/* Scroll to top on every route change */}
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          {/* Main Pages */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

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
