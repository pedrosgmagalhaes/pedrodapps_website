import React from "react";
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
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
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
      </main>
    </div>
  );
}

export default App;
