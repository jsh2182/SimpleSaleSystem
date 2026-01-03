import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./index.css";
import "./styles/fonts.css";
import { Provider } from "react-redux";
import store from "./store/index.js";
import App from './App.jsx';

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.ready.then(() => {
      console.log("✅ Service Worker is ready.");
    });
  });
}
