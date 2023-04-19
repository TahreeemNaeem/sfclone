import { ethers } from 'ethers';
import React, { useContext, useState, useEffect } from 'react';
import { MyContext } from './MyContext';
import { Link } from 'react-router-dom';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json';
import logo from '../assets/header.22c6a9d7f5e5c2e67ec1.png'

export default function Staked() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [stakednfts, setStakedNfts] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const[ended,setended] = useState([]);
  const[displayDetail,setDisplayDetail] = useState(false);
  const [stakeDuration, setStakeDuration] = useState();
  const [tokenid, setTokenId] = useState();
  const [ stakeReward, setstakeReward] = useState();
  const myNFTContract = new ethers.Contract('0x3F5A0bB76577e96A2cA9b3C8065D97a8A78d5FdB', ABI, (signer));
  const stakingcontract = new ethers.Contract('0x000e70E0bA6652EED330C4861d4f7000D96D91aB', stakingabi, (signer));

  useEffect(() => {
    async function fetchData() {
      const userAddress = await signer.getAddress();
      setAddress(userAddress.toString());

      const nids = await stakingcontract.getStakedTokenIds(userAddress);
      const ids = nids.map((id) => id.toNumber());
      setStakedNfts(ids);

      const resolvedEndTimes = await Promise.all(ids.map((id) => stakingcontract.getEndTime(id)));
      setEndTimes(resolvedEndTimes.map((time) => time.toNumber()));

      await getImage(stakednfts);
      setLoading(false); // Set loading to false when all images are fetched
    }

    fetchData();
  });

  function gettimeremaining(endTime,index) {
    const date = new Date();
    const currenttimestamp = date.getTime() / 1000;
    const timestamp = endTime - currenttimestamp;
    if(currenttimestamp<endTime){
    const secondsInADay = 86400;
    const secondsInAnHour = 3600;
    const secondsInAMinute = 60;
    const formatWithLeadingZero = (number) => number.toString().padStart(2, '0');

    const days = formatWithLeadingZero(Math.floor(timestamp / secondsInADay));
    const hours = formatWithLeadingZero(Math.floor((timestamp % secondsInADay) / secondsInAnHour));
    const minutes = formatWithLeadingZero(Math.floor((timestamp % secondsInAnHour) / secondsInAMinute));
    const seconds = formatWithLeadingZero(Math.floor(timestamp % secondsInAMinute));
    return `${days}:${hours}:${minutes}:${seconds}`;
    }
    else {
      let stakeended = ended;
          stakeended.push(index);
          setended(stakeended)
    }
  }
  async function unStake(index){
    const id=stakednfts[index];
    const stake = await stakingcontract.withdrawStake(id);
    await stake.wait();
    const nids = await stakingcontract.getStakedTokenIds(address);
    const ids = nids.map((id) => id.toNumber());
    setStakedNfts(ids);
    setDisplayDetail(false)
    const currentindex= ended.indexOf(index)
    ended[currentindex]=-1;
  }
async function getImage(ids) {
    let image =[]
    for (let i = 0; i < ids.length; i++) {
      const img = await myNFTContract.tokenURI(ids[i]);
      image[i]=img+'.png'
    }
    setImages(image)
  }

  async function stakedNftDetail(index){
    const id=stakednfts[index]
    setTokenId(id)
    const duration = (Math.floor((await stakingcontract.getStakeDuration(id)) / 86400))
    setStakeDuration(duration)
    const reward= (Math.ceil((await stakingcontract.stakeRewardCalculator(duration))/10**18))
    setstakeReward(reward)
    setDisplayDetail(true)
  }
 
  return (
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
      <div className='reward'> <h1>Stake Reward: {stakeReward}</h1>
      <img style={{marginLeft:'5px',width:'30px',height:'30px'}}  src={logo} alt="Logo" />
      </div>
      </div>:
      <h1 style={{lineHeight:"20px"}}>Click on NFT to view its details!</h1>
}
      </div>
    <div className="nft-container" style={{ border: '2px solid' }}>
      {loading ? (
        <div className='loading textstyle'>Loading...</div>
      ) : (
        images.map((image, index) => (
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
              :<span className='textstyle' style={{
                fontSize: '20px',
              }}>{gettimeremaining(endTimes[index],index)}</span>}
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );


}
  