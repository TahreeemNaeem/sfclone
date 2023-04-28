import axios from "axios";
import { ethers } from 'ethers';
import React, { useState, useEffect} from 'react';
import ABI from '../assets/myNFTContract.json';
import Nft from './Nft';
import {NftDataContext} from './Nftcontext';

export default function Nfts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [nftIds, setNftIds] = useState([]);
  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [tokenCount, setTokenCount] = useState();
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [stakeDuration, setstakeDuration] = useState('30');
  const [noNfts, setNoNfts] = useState(false);
  
  const myNFTContract = new ethers.Contract(
    '0x57c02EA259CE9a4b1030CBe21A1F1f215E5A1276',
    ABI,
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
    if (tokenCount === 0) {
    setNoNfts(true);
  }
    if (address&&tokenCount) {
      getNfts();
    }
  }, [address, tokenCount]);

  async function getNfts() {
    if (tokenCount === 0) {
      setNoNfts(true);
    }
    else{
    try {
      const response = await axios.get(
        `https://deep-index.moralis.io/api/v2/${address}/nft`,
        {
          params: {
            chain: "0xaa36a7",
            format: 'decimal',
            token_addresses:
              '0x57c02EA259CE9a4b1030CBe21A1F1f215E5A1276',
          },
          headers: {
            Accept: "application/json",
            "X-Api-Key":
              "IrYBgugBfJduG8MzGmsOV3EGekdYm1PzUqUC8gaeUxXHuNOZk09KY3NzDh44GuCn",
          },
        }
      );
      const nftData = response.data.result;
      console.log(nftData)
      const tokenIds = [];
      const tokenUris = [];
      let loadedImages = 0;
      for (const nft of nftData) {
        let metadata =nft.metadata;
        let img =JSON.parse(metadata)['image']
        console.log(img);
        tokenUris.push(img);
        tokenIds.push(nft.token_id);
        const tempImage = new Image();
        tempImage.src = img;
        tempImage.onload = () => {
          loadedImages++;
          if (loadedImages === tokenCount) {
            tokenUris.reverse()
            tokenIds.reverse()
            setNftIds(tokenIds);
            setImages(tokenUris);
            setAllImagesLoaded(true);
          }
        }
      };
    } catch (error) {
      console.error(error);
  }
}
  }
  const handleOptionChange = (event) => {
    setstakeDuration(event.target.value);
  };

  return (
    <div>
      {!allImagesLoaded ? (
        noNfts ?
          <div className="nft-container textstyle"><h1>You Don't own any santafloki NFTs</h1></div> :
          <div className='loading textstyle'>Loading...</div>
      ) : (
        <div>
          <div className="textstyle" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }}>
              <input
                type="radio"
                id="30days"
                name="days"
                value="30"
                defaultChecked={true}
                onChange={handleOptionChange}
              />
              <label
                htmlFor="30days"
              >
                30 Days
              </label>
            </div>
            <div>
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
          <div className="nft-container" style={{ border: '2px solid', marginTop: "15px" }}>
            {images.map((image, index) => (
              <div key={index}>
                 <NftDataContext.Provider value={{ id: nftIds[index], Image: image , duration: stakeDuration,setTokenCount}}>
                     <Nft/>
                 </NftDataContext.Provider>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}