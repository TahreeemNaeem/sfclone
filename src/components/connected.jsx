import { ethers } from 'ethers';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext';

export default function Connected() {
  const { isConnected, setIsConnected } = useContext(MyContext);
  const [connect, setConnect] = useState("Connected");
  const [buttonColor, setButtonColor] = useState('#20c30e');
  const [address, setAddress] = useState('');

  useEffect(() => {
    let provider;
    
    const initializeProvider = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          provider = new ethers.providers.Web3Provider(window.ethereum);
          
          // Get initial address
          const signer = provider.getSigner();
          const resolvedAddress = await signer.getAddress();
          setAddress(resolvedAddress);
          
        } catch (error) {
          console.error('Error initializing provider:', error);
          setIsConnected(false);
        }
      }
    };

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        setIsConnected(false);
        setAddress('');
      } else {
        try {
          if (provider) {
            const signer = provider.getSigner();
            const resolvedAddress = await signer.getAddress();
            setAddress(resolvedAddress);
          }
        } catch (error) {
          console.error('Error getting address after account change:', error);
          setIsConnected(false);
        }
      }
    };

    // Initialize provider and get address
    if (isConnected) {
      initializeProvider();
    }

    // Set up event listener
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // Cleanup function
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [isConnected, setIsConnected]);

  const disconnect = async () => {
    setIsConnected(false);
    setAddress('');
  };

  // Format address for display (show first 6 and last 4 characters)
  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return null; // Don't render anything if not connected
  }

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <button className='address-button textstyle'>
        <svg style={{ 
          width: "20px", 
          height: "20px", 
          marginRight: '8px', 
          verticalAlign: 'middle' 
        }}>
          <circle cx="10" cy="10" r="5" fill="#1ddb16" />
        </svg>
        {formatAddress(address)}
      </button>

      <button 
        className='connect-button textstyle tooltip'
        style={{
          backgroundColor: buttonColor,
        }}
        onClick={disconnect}
      >
        <span>{connect}</span>
        <span className="hover-text">Disconnect!</span>
        <span className="tooltiptext">
          <svg style={{ 
            width: "20px", 
            height: "20px", 
            marginRight: '8px', 
            verticalAlign: 'middle' 
          }}>
            <circle cx="10" cy="10" r="5" fill="#1ddb16" />
          </svg>
          {address}
        </span>
      </button>
    </div>
  );
}