import React from 'react';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png';

export default function Logo() {
  return (
    <div style={{
    display: 'flex',
    position:'absolute',
    top:'0',
    left:'0',
    color: '#fff',
    fontFamily:'fantasy',
    padding:'10px'
   
    }}>
    <img  width='40px' src={logo} alt="Logo" />
    <span style={{  padding:'10px',fontSize: '20px' }}>SantaFloki Staking</span>
  </div>
  );
}
