'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';

/**
 * Error Boundary Component
 * 
 * Catches errors in child components and displays a user-friendly error page.
 * Prevents entire app from crashing due to component errors.
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // Default UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <svg
                className="mx-auto w-16 h-16 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4v2m-6-4a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>

            <p className="text-gray-600 mb-6">
              We encountered an error while loading this page. Please try again or
              contact support if the problem persists.
            </p>

            <details className="mb-6 text-left bg-white rounded-lg p-4 border border-red-200">
              <summary className="cursor-pointer font-semibold text-red-600 hover:text-red-700">
                Error details
              </summary>
              <pre className="mt-3 text-xs overflow-auto text-red-800 bg-red-50 p-2 rounded">
                {this.state.error.toString()}
              </pre>
            </details>

            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="block w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
