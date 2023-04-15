import axios from "axios";
import { ethers } from 'ethers';
import React, { useContext, useState,useEffect } from 'react';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json'
import Moralis from 'moralis';

export default function Nfts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const [nftIds, setNftIds] = useState([]);
  const [images, setImages] = useState([])
  const [address, setAddress] = useState();
  const [tokencount, setTokencount] = useState();
  const [approvedNfts, setApprovedNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);


  const myNFTContract = new ethers.Contract('0xE5936FeD989bB49237BE59E41f52b007B1C0AD63', ABI, (provider.getSigner()));
  const stakingcontract = new ethers.Contract('0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a', stakingabi, (provider.getSigner()));

  useEffect(() => {
    async function fetchData() {
      const userAddress = await signer.getAddress();
      setAddress(userAddress.toString());
      
      const tokenCount = await myNFTContract.balanceOf(userAddress);
      setTokencount(tokenCount.toNumber());
      try {
        const response = await axios.get(`https://deep-index.moralis.io/api/v2/${address}/nft/collections`, {
          params: {
            chain: "0xaa36a7",
            format: 'decimal',
            token_addresses: myNFTContract
          },
          headers: {
            Accept: "application/json",
            "X-Api-Key": "IrYBgugBfJduG8MzGmsOV3EGekdYm1PzUqUC8gaeUxXHuNOZk09KY3NzDh44GuCn"
          }
        });
        setNftIds(response.data);
        console.log(nftIds)
      } catch (error) {
        console.error(error);
      }
    //  setNftIds([1,2,3])

      await approvednfts(nftIds);
      await getImage(nftIds);
    }

    fetchData();
  }, [nftIds, images, address, tokencount, approvedNfts]);

  async function approve(index) {
    const id = nftIds[index];
    console.log(id)
    const approved = await myNFTContract.approve(id, '0xE0BD2f94907F34D94a09f3820d274a35BE5Eab4a');
    await approved.wait();
    setApprovedNfts([...approvedNfts, index]);
  }

  async function stake(index) {
    const id = nftIds[index];
    console.log(id)
    const staked = await stakingcontract.addStake(id, 1);
    await staked.wait();
  }

  async function approvednfts(nftIds) {
    let nfts = []
    for (let i = 0; i < tokencount; i++) {
      if ((await myNFTContract.getApproved(nftIds[i])).toString() !== '0x0000000000000000000000000000000000000000')
        nfts[i] = i;
    }
    setApprovedNfts(nfts)
  }
  async function getImage(ids) {
    let image = [];
    let loadedImages = 0;

    for (let i = 0; i < tokencount; i++) {
      const img = await myNFTContract.tokenURI(ids[i]);
      image[i] = img;
      const tempImage = new Image();
      tempImage.src = img;
      tempImage.onload = () => {
        loadedImages++;
        if (loadedImages === tokencount) {
          setImages(image);
          setAllImagesLoaded(true);
        }
      };
    }
  }


  return (
    <div className="nft-container" style={{ border: '2px solid' }}>
  {!allImagesLoaded ? (
        <div className='loading'>Loading...</div>
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
            <button style={{
              backgroundColor:'red' ,
               height: '30px',
               width: 'max-content',
               color: 'white',
               fontSize: '20px',
               border: 'none',
               cursor: 'pointer',
               margin: '0 auto',
               borderRadius: '10px',
               boxShadow: 'none',
               fontFamily: 'myCustomFont'
             }} onClick={() => stake(index)} >Stake</button>
          ) : (
            <button  style={{
              backgroundColor:'red' ,
               height: '30px',
               width: 'max-content',
               color: 'white',
               fontSize: '20px',
               border: 'none',
               cursor: 'pointer',
               margin: '0 auto',
               borderRadius: '10px',
               boxShadow: 'none',
               fontFamily: 'myCustomFont'
             }} onClick={() => approve(index)}>Approve</button>
          )}
           </div>
        </div>
      ))
      )}
    </div>
  );
}