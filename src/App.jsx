import React, { useEffect, Suspense } from "react";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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
const Home = React.lazy(() => import("./components/Home"));
const Lessons = React.lazy(() => import("./components/Lessons"));
const Videos = React.lazy(() => import("./components/Videos"));
const TeachingFiles = React.lazy(() => import("./components/TeachingFiles"));
// Carregar sob demanda para evitar preload bloqueado por extensões
const PrivacyPolicy = React.lazy(() => import("./components/DataProtection"));
const ServicesPolicy = React.lazy(() => import("./components/ServicesPolicy"));
const CookiesPolicy = React.lazy(() => import("./components/ConsentNotice"));
const DataDeletionPolicy = React.lazy(() => import("./components/DataDeletionPolicy"));
const Members = React.lazy(() => import("./members/Members"));
const AdminTools = React.lazy(() => import("./components/AdminTools"));
import "./App.css";
import ViewportSection from "./components/ViewportSection";
import heroBg from "./assets/builderselite.png";

function App() {
  const location = useLocation();
  const pathname = location.pathname;
  const isLoginView = pathname === "/login";
  const isForgotView = pathname === "/recuperar-senha";
  const isCheckoutView = pathname === "/checkout";
  const isPrivacyView = pathname === "/privacidade";
  const isServicesView = pathname === "/servicos";
  const isCookiesView = pathname === "/cookies";
  const isDeletionView = pathname === "/exclusao-dados";
  const isPolicyView = isPrivacyView || isServicesView || isCookiesView || isDeletionView;
  const isAuthView = isLoginView || isForgotView || isCheckoutView;

  // Ponte de compatibilidade: se entrar com hash antigo, converte para path
  useEffect(() => {
    const map = {
      "#login": "/login",
      "#recuperar-senha": "/recuperar-senha",
      "#checkout": "/checkout",
      "#privacidade": "/privacidade",
      "#servicos": "/servicos",
      "#cookies": "/cookies",
      "#exclusao-dados": "/exclusao-dados",
      "#links": "/links",
      "#members": "/members",
    };
    const currentHash = window.location.hash;
    const target = map[currentHash];
    if (target && pathname !== target) {
      window.history.replaceState({}, "", target);
    }
  }, [pathname]);

  // Precarrega a imagem de fundo do Hero para evitar atraso mesmo com lazy
  useEffect(() => {
    const img = new Image();
    img.src = heroBg;
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
  }, [pathname]);

  return (
    <div className="App">
      <main className={isAuthView ? "main main--login" : isPolicyView ? "main main--policy" : "main"}>
        <Routes>
          <Route
            path="/"
            element={
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
            }
          />

          <Route
            path="/links"
            element={
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Links />
              </Suspense>
            }
          />

          <Route
            path="/members/home"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Home />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Compatibilidade: redireciona /home para /members/home */}
          <Route path="/home" element={<Navigate to="/members/home" replace />} />

          <Route
            path="/lessons"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Lessons />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/videos"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Videos />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <TeachingFiles />
                </Suspense>
              </ProtectedRoute>
            }
          />

          {/* Rota /bots/honeypot removida em favor do colapse local na Home */}

          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Members />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tools"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <AdminTools />
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Login />
                </Suspense>
              </>
            }
          />

          <Route
            path="/recuperar-senha"
            element={
              <>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <ForgotPassword />
                </Suspense>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Footer />
                </Suspense>
              </>
            }
          />

          <Route
            path="/checkout"
            element={
              <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                <Checkout />
              </Suspense>
            }
          />

          <Route
            path="/privacidade"
            element={
              <>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <PrivacyPolicy />
                </Suspense>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Footer />
                </Suspense>
              </>
            }
          />

          <Route
            path="/servicos"
            element={
              <>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <ServicesPolicy />
                </Suspense>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Footer />
                </Suspense>
              </>
            }
          />

          <Route
            path="/cookies"
            element={
              <>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <CookiesPolicy />
                </Suspense>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Footer />
                </Suspense>
              </>
            }
          />

          <Route
            path="/exclusao-dados"
            element={
              <>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <DataDeletionPolicy />
                </Suspense>
                <Suspense fallback={<div className="lazy-fallback" aria-hidden="true" />}> 
                  <Footer />
                </Suspense>
              </>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
