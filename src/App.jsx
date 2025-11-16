import React, { useEffect, useState, Suspense } from "react";
const Hero = React.lazy(() => import("./components/Hero"));
const NewsTicker = React.lazy(() => import("./components/NewsTicker"));
const Courses = React.lazy(() => import("./components/Courses"));
const Banner = React.lazy(() => import("./components/Banner"));
const Access30Days = React.lazy(() => import("./components/Access30Days"));
const Audience = React.lazy(() => import("./components/Audience"));
const VipArea = React.lazy(() => import("./components/VipArea"));
const FAQ = React.lazy(() => import("./components/FAQ"));
const FounderQuote = React.lazy(() => import("./components/FounderQuote"));
const ContactCTA = React.lazy(() => import("./components/ContactCTA"));
const Footer = React.lazy(() => import("./components/Footer"));
const Login = React.lazy(() => import("./components/Login"));
const ForgotPassword = React.lazy(() => import("./components/ForgotPassword"));
const Checkout = React.lazy(() => import("./components/Checkout"));
const Links = React.lazy(() => import("./components/Links"));
// Carregar sob demanda para evitar preload bloqueado por extensões
const PrivacyPolicy = React.lazy(() => import("./components/DataProtection"));
const ServicesPolicy = React.lazy(() => import("./components/ServicesPolicy"));
const CookiesPolicy = React.lazy(() => import("./components/ConsentNotice"));
const DataDeletionPolicy = React.lazy(() => import("./components/DataDeletionPolicy"));
import "./App.css";
import ViewportSection from "./components/ViewportSection";

function App() {
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");
  const isLoginView = hash === "#login";
  const isForgotView = hash === "#recuperar-senha";
  const isCheckoutView = hash === "#checkout";
  const isPrivacyView = hash === "#privacidade";
  const isServicesView = hash === "#servicos";
  const isCookiesView = hash === "#cookies";
  const isDeletionView = hash === "#exclusao-dados";
  const isLinksView = hash === "#links";
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
        {isLinksView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Links />
            </Suspense>
          </>
        ) : isLoginView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Login />
            </Suspense>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Footer />
            </Suspense>
          </>
        ) : isForgotView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <ForgotPassword />
            </Suspense>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Footer />
            </Suspense>
          </>
        ) : isCheckoutView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Checkout />
            </Suspense>
          </>
        ) : isPrivacyView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <PrivacyPolicy />
            </Suspense>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Footer />
            </Suspense>
          </>
        ) : isServicesView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <ServicesPolicy />
            </Suspense>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Footer />
            </Suspense>
          </>
        ) : isCookiesView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <CookiesPolicy />
            </Suspense>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Footer />
            </Suspense>
          </>
        ) : isDeletionView ? (
          <>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <DataDeletionPolicy />
            </Suspense>
            <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
              <Footer />
            </Suspense>
          </>
        ) : (
          <>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Hero />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <NewsTicker />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Courses />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Banner />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Access30Days />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Audience />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <VipArea />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <FAQ />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <FounderQuote />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <ContactCTA />
              </Suspense>
            </ViewportSection>
            <ViewportSection>
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Footer />
              </Suspense>
            </ViewportSection>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
