import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import reportWebVitals from "./reportWebVitals";

// Suppress MetaMask and other browser extension errors
const originalError = window.console.error;
window.console.error = (...args) => {
  const errorMessage = args.join(" ");
  // Filter out MetaMask connection errors
  if (
    errorMessage.includes("Failed to connect to MetaMask") ||
    errorMessage.includes(
      "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
    ) ||
    errorMessage.includes("MetaMask")
  ) {
    // Silently ignore MetaMask errors
    return;
  }
  originalError.apply(console, args);
};

// Handle unhandled promise rejections from extensions
window.addEventListener(
  "unhandledrejection",
  (event) => {
    const errorMessage =
      event.reason?.message || event.reason?.toString() || "";
    if (
      errorMessage.includes("Failed to connect to MetaMask") ||
      errorMessage.includes("MetaMask") ||
      errorMessage.includes(
        "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
      )
    ) {
      event.preventDefault(); // Prevent the error from showing
      event.stopPropagation();
      return false;
    }
  },
  true
);

// Handle general errors from extensions (with capture phase)
window.addEventListener(
  "error",
  (event) => {
    const errorMessage = event.message || event.filename || "";
    if (
      errorMessage.includes("Failed to connect to MetaMask") ||
      errorMessage.includes("MetaMask") ||
      errorMessage.includes(
        "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
      )
    ) {
      event.preventDefault(); // Prevent the error from showing
      event.stopPropagation();
      return false;
    }
  },
  true
);

// Disable React error overlay for MetaMask errors
if (process.env.NODE_ENV === "development") {
  const originalOnError = window.onerror;
  window.onerror = function (message, source, lineno, colno, error) {
    const errorMessage = message || source || "";
    if (
      errorMessage.includes("Failed to connect to MetaMask") ||
      errorMessage.includes("MetaMask") ||
      errorMessage.includes(
        "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
      )
    ) {
      return true; // Suppress error
    }
    if (originalOnError) {
      return originalOnError.apply(this, arguments);
    }
    return false;
  };

  // Remove React error overlay if it appears with MetaMask errors
  const removeErrorOverlay = () => {
    const selectors = [
      "#react-error-overlay",
      "[data-react-error-overlay]",
      'iframe[src*="react-error-overlay"]',
      'div[style*="position: fixed"][style*="z-index: 2147483647"]',
    ];

    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        const text = el.textContent || el.innerText || "";
        if (
          text.includes("Failed to connect to MetaMask") ||
          text.includes("MetaMask") ||
          text.includes("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn")
        ) {
          el.remove();
        }
      });
    });
  };

  // Check immediately and periodically
  setTimeout(removeErrorOverlay, 0);
  setInterval(removeErrorOverlay, 100);

  // Also watch for new elements
  const observer = new MutationObserver(removeErrorOverlay);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
