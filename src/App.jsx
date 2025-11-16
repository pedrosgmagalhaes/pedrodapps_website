import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import NewsTicker from "./components/NewsTicker";
import Courses from "./components/Courses";
import Banner from "./components/Banner";
import Access30Days from "./components/Access30Days";
import Audience from "./components/Audience";
import VipArea from "./components/VipArea";
import FAQ from "./components/FAQ";
import FounderQuote from "./components/FounderQuote";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Checkout from "./components/Checkout";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ServicesPolicy from "./components/ServicesPolicy";
import CookiesPolicy from "./components/CookiesPolicy";
import DataDeletionPolicy from "./components/DataDeletionPolicy";
import "./App.css";

function App() {
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  const isLoginView = hash === "#login";
  const isForgotView = hash === "#recuperar-senha";
  const isCheckoutView = hash === "#checkout";
  const isPrivacyView = hash === "#privacidade";
  const isServicesView = hash === "#servicos";
  const isCookiesView = hash === "#cookies";
  const isDeletionView = hash === "#exclusao-dados";
  const isPolicyView = isPrivacyView || isServicesView || isCookiesView || isDeletionView;
  const isAuthView = isLoginView || isForgotView || isCheckoutView;

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="App">
      {!isAuthView && !isPolicyView && <Header />}
      <main className={
        isAuthView ? "main main--login" : isPolicyView ? "main main--policy" : "main"
      }>
        {isLoginView ? (
          <>
            <Login />
            <Footer />
          </>
        ) : isForgotView ? (
          <>
            <ForgotPassword />
            <Footer />
          </>
        ) : isCheckoutView ? (
          <>
            <Checkout />
            <Footer />
          </>
        ) : isPrivacyView ? (
          <>
            <PrivacyPolicy />
            <Footer />
          </>
        ) : isServicesView ? (
          <>
            <ServicesPolicy />
            <Footer />
          </>
        ) : isCookiesView ? (
          <>
            <CookiesPolicy />
            <Footer />
          </>
        ) : isDeletionView ? (
          <>
            <DataDeletionPolicy />
            <Footer />
          </>
        ) : (
          <>
            <Hero />
            <NewsTicker />
            <Courses />
            <Banner />
            <Access30Days />
            <Audience />
            <VipArea />
            <FAQ />
            <FounderQuote />
            <ContactCTA />
            <Footer />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
