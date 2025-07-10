'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary">
          <div className="text-center p-8 max-w-md">
            <ShieldAlert className="mx-auto mb-4 text-netflix-red" size={64} />
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-text-secondary mb-6">
              We&apos;re having trouble loading this page. Please try refreshing or come back later.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-netflix-red hover:bg-netflix-red-dark text-white px-6 py-3 rounded-lg transition-colors font-medium"
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
