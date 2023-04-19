import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png';
import ABI from '../assets/stakingabi.json';
import myNFTContract from '../assets/myNFTContract.json';

export default function MainPage() {
  const [rewardReceived, setRewardReceived] = useState('...');
  const [stakeCount, setStakeCount] = useState('');
  const [totalSupply, setTotalSupply] = useState();
  const [loadingReward, setLoadingReward] = useState(true);
  const [loadingStakeCount, setLoadingStakeCount] = useState(true);
  const [loadingTotalSupply, setLoadingTotalSupply] = useState(true);
  

  const provider = new ethers.providers.Web3Provider(window.ethereum);

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

  Promise.all([stakeCountPromise, rewardReceivedPromise, totalSupplyPromise])
    .then(([stakeCount, rewardReceived, totalSupply]) => {
      setStakeCount(stakeCount.toString());
      setLoadingStakeCount(false);
      setRewardReceived(rewardReceived.toString());
      setLoadingReward(false);
      setTotalSupply(totalSupply.toString());
      setLoadingTotalSupply(false);
    })
    .catch((error) => {
      console.log(error);
    });
  },);

  return (
    <div>
      <div className="text-with-line textstyle">
        <div className="text">
          {loadingStakeCount && loadingReward && loadingTotalSupply ?
          <div className='loading'>Loading...</div>:
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
        </div>}
        </div>
        <div className="line"></div>
        <div className="text">
          {loadingStakeCount && loadingReward && loadingTotalSupply ?
          <div className='loading'>Loading...</div>:
          <div className="text" >
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
          </div>}
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
            {rewardReceived/10**18}
        <img style={{marginLeft:'5px',width:'30px',height:'30px',display:'inline-flex'}}  src={logo} alt="Logo" /></h1>

         <h1 style={{marginLeft:'5px', fontSize:'20px' , display:'inline-flex',alignItems:'center'}}>HoHoHo</h1></div>
     
      <div><h1 className='divtext textstyle'>Rewarded</h1></div>
    </div>

        <h1 className='connect-wallet-text textstyle'
        >Please Connect Your Wallet</h1>
    </div>
  );
}