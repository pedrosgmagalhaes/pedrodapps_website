import React, { useEffect, useState } from "react";
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
// Carregar sob demanda para evitar preload bloqueado por extensões
const PrivacyPolicy = React.lazy(() => import("./components/DataProtection"));
import ServicesPolicy from "./components/ServicesPolicy";
const CookiesPolicy = React.lazy(() => import("./components/ConsentNotice"));
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

  // Inicializa animações de reveal ao rolar a página
  useEffect(() => {
    if (typeof window === "undefined") return;
    const elements = document.querySelectorAll(".reveal-on-scroll");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    elements.forEach((el, idx) => {
      // ajuda a criar delays sutis em grupos
      el.style.setProperty("--animate-index", String(idx));
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hash]);

  return (
    <div className="App">
      <main
        className={isAuthView ? "main main--login" : isPolicyView ? "main main--policy" : "main"}
      >
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
