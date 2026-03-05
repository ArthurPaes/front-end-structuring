/**
 * @file ErrorBoundary — catches render errors and shows a fallback UI.
 *
 * NOTE: Error boundaries MUST be class components (React limitation).
 * This is the ONE exception to our "no class components" rule.
 *
 * Integrates with the error monitoring lib to report crashes.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { captureException } from '@/lib/errorMonitoring';

interface ErrorBoundaryProps {
  /** Fallback UI to render when an error is caught */
  fallback?: ReactNode;
  /** Optional: scope name for error reporting */
  scope?: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    captureException(error, {
      tags: { scope: this.props.scope ?? 'unknown' },
      extra: { componentStack: info.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8" role="alert">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{this.state.error?.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
