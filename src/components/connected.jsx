import { ethers } from 'ethers';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext';

export default function Connected() {
  const { isConnected, setIsConnected } = useContext(MyContext);
  const [connect, setConnect] = useState("Connected");
  const [buttonColor, setButtonColor] = useState('#20c30e');
  const [address, setAddress] = useState('');

  const provider = (new ethers.providers.Web3Provider(window.ethereum));

  window.ethereum.on('accountsChanged', handleAccountsChanged);

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      setIsConnected(false);
    } else {
      provider.getSigner().getAddress().then((resolvedAddress) => {
        setAddress(resolvedAddress.toString());
      });
    }
  }

  useEffect(() => {
    provider.getSigner().getAddress().then((resolvedAddress) => {
      setAddress(resolvedAddress.toString());
    });
  }, []);

  const disconnect = async () => {
    setIsConnected(false);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {
        isConnected &&
        <button className='address-button textstyle'>
          <svg style={{ width: "20", height: "20", alignContent: 'left', verticalAlign: 'middle' }}>
            <circle cx="10" cy="10" r="5" fill="#1ddb16" />
          </svg>
          {address}
        </button>
      }
      <button className='connect-button textstyle'
        style={{
          backgroundColor: buttonColor,
        }}
        onClick={() => { disconnect() }}
      >
        <span>{connect}</span>
        {<span className="hover-text">Disconnect!</span>}
      </button>
    </div>
  );
}