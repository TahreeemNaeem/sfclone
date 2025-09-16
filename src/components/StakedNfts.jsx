import { ethers } from 'ethers';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png'

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Staked() {
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [stakednfts, setStakedNfts] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ended, setEnded] = useState([]);
  const [displayDetail, setDisplayDetail] = useState(false);
  const [stakeDuration, setStakeDuration] = useState();
  const [tokenid, setTokenId] = useState();
  const [stakeReward, setStakeReward] = useState();
  const [noStakedNfts, setNoStakedNfts] = useState(false);
  const [loader, setLoader] = useState(true);
  const [time, setTime] = useState([]);
  const [unstaking, setUnstaking] = useState(null); // Track which NFT is being unstaked
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [contracts, setContracts] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const myNFTContract = new ethers.Contract(
        '0x57c02EA259CE9a4b1030CBe21A1F1f215E5A1276', 
        ABI, 
        signer
      );
      const stakingcontract = new ethers.Contract(
        '0xa2402b09fA456D7F39F0f3dF1a6b9CFa50783556', 
        stakingabi, 
        signer
      );

      setContracts({ myNFTContract, stakingcontract, signer });
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!contracts) return;

      try {
        const userAddress = await contracts.signer.getAddress();
        setAddress(userAddress.toString());
        
        const nids = await contracts.stakingcontract.getStakedTokenIds(userAddress);
        const ids = nids.map((id) => id.toNumber());
        
        if (ids.length === 0) {
          setNoStakedNfts(true);
          setLoading(false);
          return;
        }

        setStakedNfts(ids);
        
        const resolvedEndTimes = await Promise.all(
          ids.map((id) => contracts.stakingcontract.getEndTime(id))
        );
        setEndTimes(resolvedEndTimes.map((time) => time.toNumber()));
        
        await getImage(ids);
      } catch (error) {
        console.error('Error fetching staked NFTs:', error);
        if (error.reason === "No NFT staked!" || error.message?.includes("No NFT staked")) {
          setNoStakedNfts(true);
        }
        setLoading(false);
      }
    }
    
    fetchData();
  }, [contracts]);

  const updateRemainingTime = useCallback(() => {
    if (stakednfts.length > 0 && 
        images.length === stakednfts.length && 
        endTimes.length === stakednfts.length) {
      gettimeremaining();
      setLoader(false);
    }
  }, [stakednfts, endTimes, images]);

  useInterval(updateRemainingTime, 1000);

  function gettimeremaining() {
    const date = new Date();
    const currenttimestamp = date.getTime() / 1000;
    let times = [];
    let newEnded = [...ended];

    for (let i = 0; i < stakednfts.length; i++) {
      let endTime = endTimes[i];
      const timestamp = endTime - currenttimestamp;
      
      if (currenttimestamp < endTime) {
        const secondsInADay = 86400;
        const secondsInAnHour = 3600;
        const secondsInAMinute = 60;
        const formatWithLeadingZero = (number) => number.toString().padStart(2, '0');
        
        const days = formatWithLeadingZero(Math.floor(timestamp / secondsInADay));
        const hours = formatWithLeadingZero(Math.floor((timestamp % secondsInADay) / secondsInAnHour));
        const minutes = formatWithLeadingZero(Math.floor((timestamp % secondsInAnHour) / secondsInAMinute));
        const seconds = formatWithLeadingZero(Math.floor(timestamp % secondsInAMinute));
        
        times[i] = `${days}:${hours}:${minutes}:${seconds}`;
      } else {
        if (!newEnded.includes(i)) {
          newEnded.push(i);
        }
        times[i] = "00:00:00:00";
      }
    }
    
    if (newEnded.length !== ended.length) {
      setEnded(newEnded);
    }
    setTime(times);
  }

  async function unStake(index) {
    if (!contracts) return;
    
    setUnstaking(index);
    try {
      const id = stakednfts[index];
      const stake = await contracts.stakingcontract.withdrawStake(id);
      await stake.wait();
      
      // Refresh the staked NFTs list
      const nids = await contracts.stakingcontract.getStakedTokenIds(address);
      const ids = nids.map((id) => id.toNumber());
      setStakedNfts(ids);
      setDisplayDetail(false);
      
      // Remove from ended array
      const newEnded = ended.filter(endedIndex => endedIndex !== index);
      setEnded(newEnded);
      
      // Update other arrays to match new staked NFTs
      if (ids.length === 0) {
        setNoStakedNfts(true);
      } else {
        // Refresh end times and images for remaining NFTs
        const resolvedEndTimes = await Promise.all(
          ids.map((id) => contracts.stakingcontract.getEndTime(id))
        );
        setEndTimes(resolvedEndTimes.map((time) => time.toNumber()));
        await getImage(ids);
      }
    } catch (error) {
      console.error('Error unstaking NFT:', error);
    } finally {
      setUnstaking(null);
    }
  }

  async function getImage(ids) {
    if (!contracts || ids.length === 0) return;
    
    try {
      const imagePromises = ids.map(async (id, i) => {
        try {
          const URI = await contracts.myNFTContract.tokenURI(id);
          const response = await fetch(URI);
          const metadata = await response.json();
          return { index: i, image: metadata.image };
        } catch (error) {
          console.error(`Error fetching image for token ${id}:`, error);
          return { index: i, image: '' };
        }
      });

      const imageResults = await Promise.all(imagePromises);
      const newImages = new Array(ids.length);
      
      imageResults.forEach(result => {
        newImages[result.index] = result.image;
      });

      setImages(newImages);
    } catch (error) {
      console.error('Error getting images:', error);
    } finally {
      setLoading(false);
    }
  }

  async function stakedNftDetail(index) {
    if (!contracts) return;
    
    setLoadingDetails(true);
    try {
      const id = stakednfts[index];
      setTokenId(id);
      
      const durationBN = await contracts.stakingcontract.getStakeDuration(id);
      const duration = Math.floor(durationBN.toNumber() / 86400);
      setStakeDuration(duration);
      
      const rewardBN = await contracts.stakingcontract.stakeRewardCalculator(duration);
      const reward = Math.ceil(parseFloat(ethers.utils.formatEther(rewardBN)));
      setStakeReward(reward);
      
      setDisplayDetail(true);
    } catch (error) {
      console.error('Error getting NFT details:', error);
    } finally {
      setLoadingDetails(false);
    }
  }

  // Main loading spinner component
  const LoadingSpinner = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #20c30e',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // Small loading spinner for individual items
  const SmallSpinner = () => (
    <div style={{
      width: '20px',
      height: '20px',
      border: '2px solid #f3f3f3',
      borderTop: '2px solid #20c30e',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto'
    }}></div>
  );

  if (noStakedNfts) {
    return (
      <div className='nft-container textstyle'
 style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        padding: '40px 20px'
      }}>
        <div className='nft-container textstyle' style={{
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '40px',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{ 
            margin: '0',
            fontSize: '24px',
            color: '#fff' 
          }}>
            You don't have any NFTs staked!
          </h1>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='textstyle' style={{
        textAlign: 'center',
        padding: '60px 20px'
      }}>
        <LoadingSpinner />
        <h2 style={{ 
          marginTop: '20px', 
          color: '#fff',
          fontSize: '18px' 
        }}>
          Loading your staked NFTs...
        </h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div className='stakedNFTDetails' style={{
        color: '#fff',
        fontFamily: 'MyCustomFont',
        fontSize: '14px',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        minHeight: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {loadingDetails ? (
          <div style={{ textAlign: 'center' }}>
            <SmallSpinner />
            <p style={{ marginTop: '10px', margin: '10px 0 0 0' }}>Loading NFT details...</p>
          </div>
        ) : displayDetail ? (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '20px',
              fontWeight: 'bold' 
            }}>
              Token #{tokenid}
            </h1>
            <h1 style={{ 
              margin: '0 0 10px 0', 
              fontSize: '16px' 
            }}>
              Stake Duration: {stakeDuration} Days
            </h1>
            <h1 style={{ 
              margin: '0', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              Stake Reward: {stakeReward}
              <img 
                style={{
                  width: '24px',
                  height: '24px'
                }} 
                src={logo} 
                alt="Logo" 
              />
              HoHoHo
            </h1>
          </div>
        ) : (
          <h1 style={{ 
            margin: '0',
            fontSize: '18px',
            textAlign: 'center',
            opacity: '0.8'
          }}>
            Click on an NFT to view its details!
          </h1>
        )}
      </div>
      
      {/* NFTs Grid */}
      <div className="nft-container" style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '25px',
        padding: '20px',
        // backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        border: '2px solid rgba(255, 255, 255, 0.1)'
      }}>
        {images.map((image, index) => (
          <div key={`${stakednfts[index]}-${index}`} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '15px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}>
            <div 
              className='NFT' 
              onClick={() => stakedNftDetail(index)}
              style={{
                marginBottom: '15px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <img
                src={image || '/path/to/fallback-image.png'}
                alt={`NFT ${stakednfts[index]}`}
                style={{
                  height: '180px',
                  width: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                onError={(e) => {
                  e.target.src = '/path/to/fallback-image.png';
                }}
              />
            </div>
            
            <div style={{
              textAlign: 'center',
              minHeight: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {ended.includes(index) ? (
                <button 
                  className='buttons' 
                  onClick={() => unStake(index)}
                  disabled={unstaking === index}
                  style={{
                    backgroundColor: unstaking === index ? '#666' : '#20c30e',
                    color: '#fff',
                    border: 'none',
                     fontFamily: 'MyCustomFont',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: unstaking === index ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {unstaking === index ? (
                    <>
                      <SmallSpinner />
                      Unstaking...
                    </>
                  ) : (
                    'Withdraw Stake'
                  )}
                </button>
              ) : loader ? (
                <div style={{ padding: '12px 0' }}>
                  <SmallSpinner />
                </div>
              ) : (
                <div className='textstyle' style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#20c30e',
                  backgroundColor: 'rgba(32, 195, 14, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid rgba(32, 195, 14, 0.3)',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}>
                  {time[index] || "00:00:00:00"}
                </div>
              )}
            </div>
            
            {/* Token ID Badge */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              #{stakednfts[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}