import React from 'react';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png';

export default function Logo() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      fontSize: '1.5rem',
      padding: '12px',
      color:'white',
      '@media(max-width: 768px)': { // adjust styles for screens smaller than 768px
      fontSize: '1.2rem',
      padding: '5px'
      }
    }}>
      <img width='40px' src={logo} alt="Logo" />
      SantaFloki Staking
    </div>
  );
}
