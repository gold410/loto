import React from 'react';

export default function Layout({ children }) {
  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '20px'
    }}>
      {children}
    </div>
  );
}