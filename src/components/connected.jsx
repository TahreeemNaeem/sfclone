import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import { MyContext } from './MyContext';

export default function Connected() {
  const {myBooleanVariable,setMyBooleanVariable } = useContext(MyContext);
  const [connect,setconnect] = useState("Connected")
  const [buttonColor, setButtonColor] = useState('#20c30e');
  const [Address,setAddress] = useState('');

  const provider= (new ethers.providers.Web3Provider(window.ethereum));

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    function  handleAccountsChanged(accounts) {
      if(accounts.length===0){
        setMyBooleanVariable(false)
      }
      else{
        provider.getSigner().getAddress().then((resolvedAddress) => {
          setAddress(resolvedAddress.toString());
        });
      }
    }
    useEffect(() => {
      provider.getSigner().getAddress().then((resolvedAddress) => {
        setAddress(resolvedAddress.toString());
      });
    },);
    const disconnect = async () => {
      setMyBooleanVariable(false)
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
        myBooleanVariable &&
      <button className='address-button'
      style={{
        height: '30px',
        width: '120px',
        backgroundColor: '#499bfa',
        color: 'white',
        fontSize: '15px',
        border: 'none',
        cursor: 'pointer',
        margin: '0 auto',
        borderRadius: '10px',
        boxShadow: 'none',
        fontFamily: 'fantasy',
        marginRight:'5px',
        overflow:'hidden',
        whiteSpace:'nowrap',
        textOverflow:'ellipsis'
      }}>
        <svg  style={{width:"20", height:"20", alignContent:'left',verticalAlign:'middle'}} >
        <circle cx="10" cy="10" r="5" fill="#1ddb16" />
        </svg>
          {Address}
      </button>
}
      <button className='connect-button'
        style={{
          height: '30px',
          width: 'auto',
          backgroundColor:buttonColor ,
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
        onClick={() => { disconnect()}}
      >
        <span>{connect}</span>
         {  <span className="hover-text">Disconnect!</span>}
         </button>

    </div>
  );
  
}
