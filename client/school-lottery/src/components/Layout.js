import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{
      width: '100%',
      boxSizing: 'border-box',
      // rely on .app-container margin for top spacing to avoid adding extra page height
      paddingTop: '0',
      minHeight: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    }}>
      {children}
    </div>
  );
}