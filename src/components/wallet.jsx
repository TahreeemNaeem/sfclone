import React, { useContext, useState } from 'react';
import { MyContext } from './MyContext';

export default function Connect() {

  const {setIsConnected } = useContext(MyContext);
  const [connect,setconnect] = useState("Connect Wallet")
  const [buttonColor, setButtonColor] = useState('#499bfa');
  
  const connectwallet = async () => {
    setconnect('Connecting!');
    setButtonColor('#b00617');
    if (window.ethereum) {
      try {
      const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if(addresses.length!==0){
        setIsConnected(true);
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
         <button className='textstyle buttons'
         style={{
           backgroundColor:buttonColor ,
           marginRight:'7px'
         }}
         onClick={() => { connectwallet()}}>
         {connect}   
    </button>
    </div>
    );
  
}
