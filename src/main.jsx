import React from 'react';
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

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found');
}

const ROOT_KEY = '__ratingPistolReactRoot__';
const root = globalThis[ROOT_KEY] ?? createRoot(container);
globalThis[ROOT_KEY] = root;

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ErrorBoundary>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </ThemeProvider>
);
