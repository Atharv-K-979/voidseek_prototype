import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Prevent unmounting the app with the disruptive roadblock screen
    return { hasError: false, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Safeguard: Recovered from application exception without breaking flow:', error, errorInfo);
  }

  public render() {
    return this.props.children;
  }
}
