import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err, info) { console.error('UI crash:', err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: 'system-ui' }}>
          <h1>Something went wrong.</h1>
          <p>Open DevTools → Console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
