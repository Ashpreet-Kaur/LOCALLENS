// 🛡️ Error Boundary Component
// Fixes Problem #10: Missing Error Handling
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when error occurs
      return (
        <div className="container text-center py-5">
          <div style={{ fontSize: "80px" }}>⚠️</div>
          <h2 className="text-danger mb-3">Oops! Something went wrong</h2>
          <p className="text-muted mb-4">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          
          {/* Show error details in development mode */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="text-start bg-light p-3 rounded" style={{ maxWidth: 600, margin: '0 auto' }}>
              <summary className="fw-bold text-danger cursor-pointer">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 small text-danger">
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          
          <div className="mt-4">
            <button 
              className="btn btn-primary me-2"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
