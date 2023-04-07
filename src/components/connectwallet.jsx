import { ethers } from 'ethers';
import React, { useContext, useState } from 'react';
import { MyContext } from './MyContext';

export default function Connect() {
  const {setMyBooleanVariable } = useContext(MyContext);
  const [connectioninfo,setconnectioninfo] = useState('')
  const [connect,setconnect] = useState('Connect Wallet')

  const connectWallet = async () => {
    const provider= (new ethers.providers.Web3Provider(window.ethereum));
    if (window.ethereum) {
      setconnect('Connecting')
      const network = await provider.getNetwork()
      try {
      if (network.chainId !== 11155111) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], 
          });
      }
      const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(addresses.length!==0){
        setMyBooleanVariable(true);
        setconnect('Disconnect')
        }
    }
    catch(error)  {
      if (error.code === 4001) {
        setconnectioninfo('Please connect to MetaMask. User rejected Connection');
        setconnect('Connect Wallet')
      }
      else{
        setconnectioninfo(`Error: ${error.message}`);
        setconnect('Connect Wallet')
      }
     }
    }
    else {
      setconnectioninfo('Please Install Metamask!!!');
      setconnect('Connect Wallet')
    }
  };

  return (
    <div style={{
      display:'flex',
      flexWrap:'wrap'
    }}> 
    <button style={{
      height: '35px',
      width: '150px',
      backgroundColor: '#499bfa',
      color: 'white',
      fontSize: '20px',
      border: 'none',
      cursor: 'pointer',
      margin: '0 auto',
      borderRadius: '10px',
      boxShadow: 'none',
      color: '#fff',
    
    }} onClick={() => connectWallet()}>{connect}</button>
    </div>);
     
}
