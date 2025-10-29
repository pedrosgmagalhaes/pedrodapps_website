import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import NewsTicker from "./components/NewsTicker";
import Courses from "./components/Courses";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <NewsTicker />
        <Courses />
      </main>
    </div>
  );
}

export default App;
