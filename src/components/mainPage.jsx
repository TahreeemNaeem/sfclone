import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png';
import ABI from '../assets/stakingabi.json';
import myNFTContract from '../assets/myNFTContract.json';

export default function MainPage() {
  const [rewardReceived, setRewardReceived] = useState(174960);
  const [stakeCount, setStakeCount] = useState(7);
  const [totalSupply, setTotalSupply] = useState(806);
  const [loadingReward, setLoadingReward] = useState(true);
  const [loadingStakeCount, setLoadingStakeCount] = useState(true);
  const [loadingTotalSupply, setLoadingTotalSupply] = useState(true);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected and ethereum is available
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletConnected(true);
            loadContractData();
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    const loadContractData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        
        const StakingContract = new ethers.Contract(
          '0xa2402b09fA456D7F39F0f3dF1a6b9CFa50783556',
          ABI,
          provider.getSigner()
        );
        
        const myNFTContractInstance = new ethers.Contract(
          '0x57c02EA259CE9a4b1030CBe21A1F1f215E5A1276',
          myNFTContract,
          provider.getSigner()
        );

        const stakeCountPromise = StakingContract.stakeCount();
        const rewardReceivedPromise = StakingContract.totalRewardReceived();
        const totalSupplyPromise = myNFTContractInstance.totalSupply();

        const [stakeCount, rewardReceived, totalSupply] = await Promise.all([
          stakeCountPromise, 
          rewardReceivedPromise, 
          totalSupplyPromise
        ]);

        setStakeCount(stakeCount.toString());
        setLoadingStakeCount(false);
        
        setRewardReceived(rewardReceived.toString());
        setLoadingReward(false);
        
        setTotalSupply(totalSupply.toString());
        setLoadingTotalSupply(false);
      } catch (error) {
        console.error('Error loading contract data:', error);
        // Set loading states to false even on error
        setLoadingStakeCount(false);
        setLoadingReward(false);
        setLoadingTotalSupply(false);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletConnected(true);
        // Reload the page or fetch contract data
        window.location.reload();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const isLoading = loadingStakeCount && loadingReward && loadingTotalSupply;

  

  return (
    <div>
      <div className="text-with-line">
        <div className="text">
          {isLoading ? (
            <div className='loading textstyle'>Loading...</div>
          ) : (
            <div>
              <h1 className="textstyle textsize" style={{display:"inline-block"}}>
                {stakeCount} of {totalSupply}
              </h1>
              <h1 className='textstyle'
                style={{
                  fontSize: '20px',
                  paddingLeft: '5px',
                  display: 'inline-block',
                }}
              >
                NFTs
              </h1>
              <h1 className="textstyle">Staked</h1>
            </div>
          )}
        </div>
        
        <div className="line"></div>
        
        <div className="text">
          {isLoading ? (
            <div className='loading textstyle'>Loading...</div>
          ) : (
            <div>
              <h1 className="textstyle textsize" style={{display:"inline-block"}}>
                {totalSupply > 0 ? ((stakeCount * 100) / totalSupply).toFixed(2) : 0} %
              </h1>
              <h1 className='textstyle'
                style={{
                  fontSize: '20px',
                  paddingLeft: '5px',
                  display: 'inline-block',
                }}
              >
                of NFTs
              </h1>
              <h1 className="textstyle">Staked</h1>
            </div>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className='loading textstyle'>Loading...</div>
      ) : (
        <div
          className="text"
          style={{
            marginTop: '50px',
            display: 'inline-block',
          }}
        >
          <div>
            <h1 className='textstyle textsize'
              style={{
                display: 'inline-block',
              }}
            >
              {(rewardReceived / 10**18).toFixed(0)}
              <img 
                style={{
                  marginLeft:'10px',
                  width:'30px',
                  marginBottom:'2px'
                }}  
                src={logo} 
                alt="Logo" 
              />
            </h1>
            <h1 className='textstyle' style={{ 
              fontSize:'20px', 
              display:'inline-block',
              paddingLeft:'5px'
            }}>
              HoHoHo
            </h1>
          </div>
          <div>
            <h1 className='textstyle'>Rewarded</h1>
          </div>
        </div>
      )}
       {walletConnected && <div>
        <h1 className='connect-wallet-text textstyle' onClick={connectWallet} style={{cursor: 'pointer'}}>
          Please Connect Your Wallet
        </h1>
      </div>}
    </div>
  );
}