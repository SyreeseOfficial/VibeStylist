import React from 'react';
import GlobalErrorState from './GlobalErrorState';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <GlobalErrorState
                    error={this.state.error}
                    resetErrorBoundary={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
