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
      fontFamily: 'MyCustomFont',
    }}>
      <img width='40px' src={logo} alt="Logo" />
      SantaFloki Staking
    </div>
    
    
  );
}