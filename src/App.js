import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { render } from "react-dom";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import Swap from "./components/Swap/Swap";
import Facuet from "./components/Facuet/Facuet";
import WhitePaper from "./components/whitePaper/WhitePaper";
import Tutorial from "./components/tutorail/Tutorial";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Reservoir from "./components/Reservoir/Reservoir";
import WaterWave from "react-water-wave";
import bg1 from "./images/bg1.jpg";
import Home from "./Home";
import BuySplash from "./components/BuySplash/BuySplash"
import { useTranslation } from "react-i18next";
function App() {
  const { t, i18n } = useTranslation();
  let [oneTokenPrice, setOneTokenPrice]=useState(0);

  useEffect(() => {

    $(document).ready(function () {
    $(".full-landing-image").ripples({
      resolution: 200,
      perturbance: 0.01,
    });
  })
  }, [$]);
  return (
    <div >
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/TheWELL" element={<Swap
          setOneTokenPrice={setOneTokenPrice}
          />} />
          <Route exact path="/THETAP" element={<Facuet
          oneTokenPrice={oneTokenPrice}
          />} />
          <Route exact path="/THESHORE" element={<Reservoir />} />
          <Route exact path="/swap" element={<BuySplash/>}/>
          <Route exact path="/tutorial" element={<Tutorial/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;