import axios from "axios";
import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json';

export default function Nfts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [nftIds, setNftIds] = useState([]);
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [tokenCount, setTokenCount] = useState();
  const [approvedNfts, setApprovedNfts] = useState([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [stakeDuration, setstakeDuration] = useState('30');
  const [buttonStatus, setButtonStatus] = useState([]);
  
  const myNFTContract = new ethers.Contract(
    '0x3F5A0bB76577e96A2cA9b3C8065D97a8A78d5FdB',
    ABI,
    provider.getSigner()
  );
  const stakingContract = new ethers.Contract(
    '0x000e70E0bA6652EED330C4861d4f7000D96D91aB',
    stakingabi,
    provider.getSigner()
  );

  useEffect(() => {
    async function fetchData() {
      const userAddress = await signer.getAddress();
      setAddress(userAddress.toString());
      const tokencount = await myNFTContract.balanceOf(userAddress);
      setTokenCount(tokencount.toNumber());
    }
    fetchData();
    approvednfts(nftIds);
  }, [nftIds, images, tokenCount, address]);

  useEffect(() => {
    if (address && tokenCount) {
      approvednfts(nftIds);
      getNfts();
    }
  }, [address, tokenCount]);

  async function approve(index) {
    const id = nftIds[index];
    console.log(id);
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "approving" }));
    try {
      const approved = await myNFTContract.approve(
        "0x000e70E0bA6652EED330C4861d4f7000D96D91aB",
        id
      );
      await approved.wait();
      setApprovedNfts([...approvedNfts, index]);
    } catch (error) {
       if(error.code===4001){
        setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
       }
    }
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
  }

  async function stake(index) {
    const id = nftIds[index];
    console.log(id);
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "staking" }));
    const staked = await stakingContract.addStake(id, stakeDuration);
    await staked.wait();
    const tokencount = await myNFTContract.balanceOf(address);
    setTokenCount(tokencount.toNumber());
    console.log(tokencount);
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
  }

  async function getNfts() {
    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2/${address}/nft`,
        {
          params: {
            chain: "0xaa36a7",
            format: 'decimal',
            token_addresses:
              '0x3F5A0bB76577e96A2cA9b3C8065D97a8A78d5FdB',
          },
          headers: {
            Accept: "application/json",
            "X-Api-Key":
              "IrYBgugBfJduG8MzGmsOV3EGekdYm1PzUqUC8gaeUxXHuNOZk09KY3NzDh44GuCn",
          },
        }
      );
      const nftData = response.data.result;
      const tokenIds = [];
      const tokenUris = [];
      let loadedImages = 0;
      for (const nft of nftData) {
        console.log(`Token ID: ${nft.token_id}, Token URI: ${nft.token_uri}`);
        tokenUris.push(nft.token_uri+'.png');
        tokenIds.push(nft.token_id);
      const tempImage = new Image();
      tempImage.src = nft.token_uri+'.png';
      tempImage.onload = () => {
        loadedImages++;
        if (loadedImages === tokenCount) {
          tokenUris.reverse()
          tokenIds.reverse()
          setNftIds(tokenIds);
          setImages(tokenUris)
          setAllImagesLoaded(true);
        }
      };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function approvednfts(nftIds) {
    let nfts = []
    for (let i = 0; i < tokenCount; i++) {
      if ((await myNFTContract.getApproved(nftIds[i])).toString() !== '0x0000000000000000000000000000000000000000')
        nfts[i] = i;
    }
    setApprovedNfts(nfts)
  }
  const handleOptionChange = (event) => {
    setstakeDuration(event.target.value);
  };

  return (
    <div>
     <div className="textstyle" style={{ display: 'flex',justifyContent:'center' }}>
      <div  style={{ borderRadius:'5px'}}>
        <input
          type="radio"
          id="30days"
          name="days"
          value="30"
          checked={stakeDuration === '30'}
          defaultChecked={true}
          onChange={handleOptionChange}
        />
        <label
          htmlFor="30days"
        >
          30 Days
        </label>
      </div>
      <div style={{ }}>
        <input
          type="radio"
          id="60days"
          name="days"
          value="60"
          checked={stakeDuration === '60'}
          onChange={handleOptionChange}
        />
        <label
          htmlFor="60days"          >
          60 Days
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="90days"
          name="days"
          value="90"
          checked={stakeDuration === '90'}
          onChange={handleOptionChange}
        />
        <label
          htmlFor="90days"
        >
          90 Days
        </label>
      </div>
    </div>
    <div className="nft-container" style={{ border: '2px solid' , marginTop:"15px" }}>
  {!allImagesLoaded ? (
        <div className='loading textstyle'>Loading...</div>
  ):(
      images.map((image, index) => (
        <div key={index}>
          <div className='NFT'><img
            src={image}
            alt={`image ${index + 1}`}
          style={{
            height:'160px',
            width:'160px'
          }}
           /></div>
          <div>
  {approvedNfts.includes(index) ? (
    <button
      className="buttons textstyle"
      onClick={() => stake(index)}
      disabled={buttonStatus[index] === "staking"}
    >
      {buttonStatus[index] === "staking" ? "Staking" : "Stake"}
    </button>
  ) : (
    <button
      className="buttons textstyle"
      onClick={() => approve(index)}
      disabled={buttonStatus[index] === "approving"}
    >
      {buttonStatus[index] === "approving" ? "Approving" : "Approve"}
    </button>
  )}
</div>
        </div>
      ))
      )}
    </div>
    </div>
  );
}