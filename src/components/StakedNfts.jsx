import { ethers } from 'ethers';
import React, { useState, useEffect,useRef,useCallback } from 'react';
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
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  var uriPrefix = 'https://santafloki.mypinata.cloud/ipfs'
  const signer = provider.getSigner();
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [stakednfts, setStakedNfts] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ended,setended] = useState([]);
  const [displayDetail,setDisplayDetail] = useState(false);
  const [stakeDuration, setStakeDuration] = useState();
  const [tokenid, setTokenId] = useState();
  const [stakeReward, setstakeReward] = useState();
  const [noStakedNfts,setNoStakedNfts] = useState(false);
  const [loader, setLoader] = useState(true);
  const [time, setTime] = useState([]);

  const myNFTContract = new ethers.Contract('0x57c02EA259CE9a4b1030CBe21A1F1f215E5A1276', ABI, (signer));
  const stakingcontract = new ethers.Contract('0xa2402b09fA456D7F39F0f3dF1a6b9CFa50783556', stakingabi, (signer));

  useEffect(() => {
    async function fetchData() {
      try {
        const userAddress = await signer.getAddress();
        setAddress(userAddress.toString());
        const nids = await stakingcontract.getStakedTokenIds(userAddress);
        const ids = nids.map((id) => id.toNumber());
        setStakedNfts(ids);
        const resolvedEndTimes = await Promise.all(ids.map((id) => stakingcontract.getEndTime(id)));
        setEndTimes(resolvedEndTimes.map((time) => time.toNumber()));
        await getImage(ids);
      } catch (error) {
        if (error.reason === "No NFT staked!") {
          setNoStakedNfts(true);
        } else {
          console.log(error);
        }
      }
    }
    fetchData();
  },[]);
  const updateRemainingTime = useCallback(() => {
    if(images.length===stakednfts.length&&(endTimes.length===stakednfts.length)){
      gettimeremaining();
      setLoader(false)
    }
  }, [stakednfts, endTimes,images]);

  useInterval(updateRemainingTime, 1000);

  function gettimeremaining() {
    const date = new Date();
    const currenttimestamp = date.getTime() / 1000;
    let times =[];
    for(let i=0;i<stakednfts.length;i++){
    let endTime=endTimes[i];
    const timestamp = endTime - currenttimestamp;
    if(currenttimestamp<endTime){
      const secondsInADay = 86400;
      const secondsInAnHour = 3600;
      const secondsInAMinute = 60;
      const formatWithLeadingZero = (number) => number.toString().padStart(2,'0');
      const days = formatWithLeadingZero(Math.floor(timestamp / secondsInADay));
      const hours = formatWithLeadingZero(Math.floor((timestamp % secondsInADay) / secondsInAnHour));
      const minutes = formatWithLeadingZero(Math.floor((timestamp % secondsInAnHour) / secondsInAMinute));
      const seconds = formatWithLeadingZero(Math.floor(timestamp % secondsInAMinute));
      times[i]=`${days}:${hours}:${minutes}:${seconds}`;
    }
    else {
      let stakeended = ended;
      stakeended.push(i);
      setended(stakeended)
    }
   }
   setTime(times);
  }
  async function unStake(index){
    const id=stakednfts[index];
    const stake = await stakingcontract.withdrawStake(id);
    await stake.wait();
    const nids = await stakingcontract.getStakedTokenIds(address);
    const ids = nids.map((id) => id.toNumber());
    setStakedNfts(ids);
    setDisplayDetail(false);
    const currentindex= ended.indexOf(index);
    ended[currentindex]=-1;
  }
async function getImage(ids) {
    let image =[];
    for (let i = 0; i < ids.length; i++) {
      var URI = await myNFTContract.tokenURI(ids[i]);
      fetch(URI)
      .then(res => res.json())
         .then(async metadata =>{
          const img =metadata.image
          //let splitUri = img.split('ipfs')
          //img=uriPrefix+splitUri[2]
          console.log(img)
          image[i]=img;
            })
           .catch(err => { throw err });
    }
    setImages(image);
    setLoading(false);  
  }

  async function stakedNftDetail(index){
    const id=stakednfts[index];
    setTokenId(id);
    const duration = (Math.floor((await stakingcontract.getStakeDuration(id)) / 86400));
    setStakeDuration(duration);
    const reward= (Math.ceil((await stakingcontract.stakeRewardCalculator(duration))/10**18));
    setstakeReward(reward);
    setDisplayDetail(true);
  }
 
  return (
    <div>
      {noStakedNfts?
      (<div className='nft-container textstyle'><h1>You don't have any NFTs staked!</h1></div>):
         ( <div>
          
          {loading ? (
              <div className='loading textstyle'>Loading...</div>
                ) : (
              <div>
                    <div className=' stakedNFTDetails '
                 style={{
                  color:'#fff',
                  fontFamily:'MyCustomFont',
                  fontSize:'12px'
                }}>
                  {displayDetail?
                    <div>
                    <h1>Token#{tokenid}</h1>
                    <h1>Stake Duration: {stakeDuration} Days</h1>
                    <h1>Stake Reward: {stakeReward}<img style={{marginLeft:'5px',width:'30px',height:'30px',verticalAlign:'middle'}}  src={logo} alt="Logo" /></h1>
                    </div>:
                    <h1 style={{lineHeight:"20px"}}>Click on NFT to view its details!</h1>
                   
                  }
                   </div>
                   <div className="nft-container" style={{ border: '2px solid' }}>
                   {images.map((image, index) => (
                         <div key={index}>
                         <div className='NFT' onClick={()=>stakedNftDetail(index)}>
                           <img
                             src={image}
                             alt={`image ${index + 1}`}
                             style={{
                               height: '160px',
                               width: '160px'
                             }}
                           />
                         </div>
                         <div>
                          { ended.includes(index) ? 
                          <button className='buttons' onClick={()=>unStake(index)}>WithDraw Stake</button>
                           :loader ?
                           <div className="loader"></div> :
                           <span className='textstyle' style={{
                             fontSize: '20px',
                           }}>{time[index]}</span>}
                         </div>
                       </div>
                     ))}
                   </div>
              </div> )}
         </div>)
       }
    </div>
  );
}
  