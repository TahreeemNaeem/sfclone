import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { MyContext } from './MyContext';

export default function Mainpage() {
  const {myBooleanVariable,setMyBooleanVariable } = useContext(MyContext);
  return(
    <div>
        <h1 className='connect-wallet-text'
        style={{
            color:'white',
            fontFamily:'fantasy',
            lineHeight:'1.2',
            fontSize:'calc(1.375rem + 1.5vw)',
        }}>Please Connect Your Wallet</h1>
    </div>
  );
}