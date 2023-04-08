import { ethers } from 'ethers';
import React, { useContext, useState } from 'react';
import { MyContext } from './MyContext';

export default function Connect() {

  const {setMyBooleanVariable } = useContext(MyContext);
  const [connect,setconnect] = useState("Connect Wallet")
  const [buttonColor, setButtonColor] = useState('#499bfa');

  const provider= (new ethers.providers.Web3Provider(window.ethereum));
  
  const connectwallet = async () => {
    setconnect('Connecting!');
    setButtonColor('#b00617');
    if (window.ethereum) {
      try {
      const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(addresses.length!==0){
        setMyBooleanVariable(true);
        setconnect('connected')
        setButtonColor('#20c30e')
        }
    }
    catch(error)  {
      if (error.code === 4001) {
        setconnect('Connect Wallet')
        setButtonColor('#499bfa')
      }
      else{
        setconnect('Connect Wallet')
        setButtonColor('#499bfa')
      }
     }
    }
    else {
      setconnect('Connect Wallet')
      setButtonColor('#499bfa')
    }
  };

 return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
         <button
         style={{
          backgroundColor:buttonColor ,
           height: '30px',
           width: 'auto',
           color: 'white',
           fontSize: '20px',
           border: 'none',
           cursor: 'pointer',
           margin: '0 auto',
           borderRadius: '10px',
           boxShadow: 'none',
           fontFamily: 'fantasy',
           marginRight:'7px'
         }}
         onClick={() => { connectwallet()}}>
         {connect}   
    </button>
    </div>
    );
  
}
