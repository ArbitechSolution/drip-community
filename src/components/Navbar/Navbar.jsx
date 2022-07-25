import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";

import uk from "../../images/uk.png";
import china from "../../images/china.png";
import korea from "../../images/korea.png";
import spain from "../../images/spain.png";
import rusia from "../../images/rusia.png";
import france from "../../images/france.png";
import { Navbar, NavDropdown, Nav, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {loadWeb3} from '../api'
import logo from "../../images/logo4.png"
const Navbarapp = () => {
  const { t, i18n } = useTranslation();

let [account, setAccount]=useState();
let [strAcc, setStrAcc]=useState()
  function handleClick(lang) {
    console.log("lang", lang);
    i18n.changeLanguage(lang);
  }

const connectWallet = async()=>{
  try{
let acc= await loadWeb3();
setAccount(acc);
let ac= acc? acc.substring(0, 6) + "..." + acc.substring(acc.length - 6):
setStrAcc(ac);
  }catch(error){
    console.log("while connecting",error )
  }
}
useEffect(() => {
setInterval(()=>{
connectWallet();
},1000)
}, [])

  return (
    <div className="fluid-container navbarmain">
      <div className="container">
        <Navbar collapseOnSelect expand="lg" className="" variant="dark">

            <Link to="/">
              <Navbar.Brand
                href=""
                style={{ color: "white" }}
                className="navbarlogo"
              >
                <img src={logo} width="185px"/>
              </Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto ">
                <Link to="/TheWELL" style={{ textDecoration: "none" }}>
                  {" "}
                  <Nav.Link href="#TheWELL" className=" " id="navbartext">
                  {t('TheWell.1')}
                  </Nav.Link>
                </Link>
                <Link to="/THETAP" style={{ textDecoration: "none" }}>
                  <Nav.Link href="#THETAP" className=" " id="navbartext">
                  {t('THETAP.1')}
                  </Nav.Link>
                </Link>
                <Link to="/THESHORE" style={{ textDecoration: "none" }}>
                  <Nav.Link href="#THESHORE" className=" " id="navbartext">
                  {t('THESHORE.1')}
                  </Nav.Link>
                </Link>
                <Link to="/swap" style={{ textDecoration: "none" }}>
                  <Nav.Link href="#swap" className=" " id="navbartext">
                  {t("SWAP.1")}
                  </Nav.Link>
                </Link>
              </Nav>
              <Nav className="me-3">
                
                <Nav.Link href="splassive_whitepaper.pdf" download id="navbartext" style={{ textDecoration: "none" }}>
                {t('Whitepaper.1')}
                </Nav.Link>
                
                <Link to="https://app.pangolin.exchange/#/swap?outputCurrency=0xbc6f589171d6d66eb44ebcc92dffb570db4208da" target="_blank" style={{ textDecoration: "none" }}>
                <Nav.Link href="https://app.pangolin.exchange/#/swap?outputCurrency=0xbc6f589171d6d66eb44ebcc92dffb570db4208da" target="_blank" id="navbartext">
                
                Buy Waves
                </Nav.Link>
                </Link>
                <Nav.Link
                  eventKey={5}
                  href="#memes"
                  id="navbartext"
                  
                >
                   {t('SplashDAO.1')}
                </Nav.Link>
                <Link to="/tutorial" style={{ textDecoration: "none" }}>
                <Nav.Link href="#Tutorial" id="navbartext">
                {t('Tutorial.1')}
                </Nav.Link>
                </Link>

                <NavDropdown title="Lang" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="" onClick={() => handleClick("en")}>
                    <img src={uk} /> {t('English.1')}
                  </NavDropdown.Item>
                  <NavDropdown.Item  onClick={() => handleClick("chi")}>
                    <img src={china} />
                    {t('China.1')}
                  </NavDropdown.Item>
                  <NavDropdown.Item  onClick={() => handleClick("Ko")}>
                    <img src={korea} />
                    {t('Korea.1')}
                  </NavDropdown.Item>
                  <NavDropdown.Item  onClick={() => handleClick("sp")}>
                    <img src={spain} />
                    {t('Spain.1')}
                  </NavDropdown.Item>
                  <NavDropdown.Item  onClick={() => handleClick("ru")}>
                    <img src={rusia} />
                    {t('Rusia.1')}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleClick("fr")}>
                    <img src={france} />
                    {t('France.1')}
                  </NavDropdown.Item>
                </NavDropdown>

                <div className="mx-2">
                  <button className="btn btn-light" >
                    <g data-v-de8c4aa0>
                      <path d="M6 0a.5.5 0 0 1 .5.5V3h3V.5a.5.5 0 0 1 1 0V3h1a.5.5 0 0 1 .5.5v3A3.5 3.5 0 0 1 8.5 10c-.002.434-.01.845-.04 1.22-.041.514-.126 1.003-.317 1.424a2.083 2.083 0 0 1-.97 1.028C6.725 13.9 6.169 14 5.5 14c-.998 0-1.61.33-1.974.718A1.922 1.922 0 0 0 3 16H2c0-.616.232-1.367.797-1.968C3.374 13.42 4.261 13 5.5 13c.581 0 .962-.088 1.218-.219.241-.123.4-.3.514-.55.121-.266.193-.621.23-1.09.027-.34.035-.718.037-1.141A3.5 3.5 0 0 1 4 6.5v-3a.5.5 0 0 1 .5-.5h1V.5A.5.5 0 0 1 6 0zM5 4v2.5A2.5 2.5 0 0 0 7.5 9h1A2.5 2.5 0 0 0 11 6.5V4H5z"></path>
                    </g>

                    {account ? "Connected" : "Connect Wallet"}
                  </button>
                </div>
              </Nav>
            </Navbar.Collapse>

        </Navbar>


      </div>
    </div>
  );
};

export default Navbarapp;
