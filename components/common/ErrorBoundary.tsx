'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-text-secondary mb-6">
              We're having trouble loading this page. Please try refreshing or come back later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
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
