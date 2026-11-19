import { useState, createContext } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DeepSkyObject from "./pages/DeepSkyObject";
import Exoplanet from "./pages/Exoplanet";
import MeteorShower from "./pages/MeteorShower";

export const userContext = createContext();
function App() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pt-10 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/deep-sky-objects' element={<DeepSkyObject />} />
          <Route path='/exoplanets' element={<Exoplanet />} />
          <Route path='/meteor-showers' element={<MeteorShower />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
