import { ethers } from 'ethers';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png';
import ABI from '../assets/stakingabi.json';
import myNFTContract from '../assets/myNFTContract.json';

export default function MainPage() {
  const [rewardReceived, setRewardReceived] = useState('');
  const [stakeCount, setStakeCount] = useState('');
  const [totalSupply, setTotalSupply] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const StakingContract = new ethers.Contract(
    '0x000e70E0bA6652EED330C4861d4f7000D96D91aB',
    ABI,
    provider.getSigner()
  );
  const myNFTContractInstance = new ethers.Contract(
    '0x3F5A0bB76577e96A2cA9b3C8065D97a8A78d5FdB',
    myNFTContract,
    provider.getSigner()
  );

  useEffect(() => {
    const stakeCountPromise = StakingContract.stakeCount();
    const rewardReceivedPromise = StakingContract.totalRewardReceived();
    const totalSupplyPromise = myNFTContractInstance.totalSupply();

    stakeCountPromise.then((stakeCount) => {
      setStakeCount(stakeCount.toString());
    });
    rewardReceivedPromise.then((rewardReceived) => {
      setRewardReceived(rewardReceived.toString());
    });
    totalSupplyPromise.then((totalSupply) => {
      setTotalSupply(totalSupply.toString());
    });
  }, []);

  return (
    <div>
      <div className="text-with-line textstyle">
        <div className="text">
          <h1>
            {stakeCount} of {totalSupply}
          </h1>
          <h1
            style={{
              fontSize: '20px',
              paddingLeft: '5px',
              display: 'inline-block',
              paddingTop: '10px',
            }}
          >
            NFTs
          </h1>
          <h1 className="divtext">Staked</h1>
        </div>

        <div className="line"></div>

        <div className="text">
          <h1>{((stakeCount * 100) / totalSupply).toFixed(2)} %</h1>
          <h1
            style={{
              fontSize: '20px',
              paddingLeft: '5px',
              display: 'inline-block',
              paddingTop: '10px',
            }}
          >
            of NFTs
          </h1>
          <h1 className="divtext">Staked</h1>
        </div>
      </div>
      <div
        className="text"
        style={{
          textAlign: 'center',
          width: '100%',
          marginTop: '50px',
          display: 'block',
        }}
      >
        <div className="textstyle" style={{ display: 'inline-flex' }}>
          <h1
            style={{
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {rewardReceived}
        <img style={{marginLeft:'5px',width:'30px',height:'30px',display:'inline-flex'}}  src={logo} alt="Logo" /></h1>

         <h1 style={{marginLeft:'5px', fontSize:'20px' , display:'inline-flex',alignItems:'center'}}>HoHoHo</h1></div>
     
      <div><h1 className='divtext textstyle'>Rewarded</h1></div>
    </div>

        <h1 className='connect-wallet-text'
        style={{
            color:'white',
            fontFamily: 'MyCustomFont',
            lineHeight:'auto',
            fontSize:'calc(1.3rem + 1.2vw)',
            width:'max-content',
            height:'max-content'
            
        }}>Please Connect Your Wallet</h1>
    </div>
  );
}