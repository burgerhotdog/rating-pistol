import React, { StrictMode } from 'react';
import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/theme';
import App from './App';

class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error(error);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <HashRouter>
          <App />
        </HashRouter>
      </ErrorBoundary>
    </ThemeProvider>
  </StrictMode>
);
