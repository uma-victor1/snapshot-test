import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if error is from MetaMask
    const errorMessage = error?.message || error?.toString() || "";
    if (
      errorMessage.includes("Failed to connect to MetaMask") ||
      errorMessage.includes("MetaMask") ||
      errorMessage.includes("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn")
    ) {
      // Silently ignore MetaMask errors
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Check if error is from MetaMask
    const errorMessage = error?.message || error?.toString() || "";
    if (
      errorMessage.includes("Failed to connect to MetaMask") ||
      errorMessage.includes("MetaMask") ||
      errorMessage.includes("chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn")
    ) {
      // Silently ignore MetaMask errors
      return;
    }
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

