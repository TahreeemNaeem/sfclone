import axios from "axios";
import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import stakingabi from '../assets/stakingabi.json';
import ABI from '../assets/myNFTContract.json';

export default function Nfts() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
 // const [nftIds, setNftIds] = useState([]);
//  const [images, setImages] = useState([]);
  const [address, setAddress] = useState();
  const [tokenCount, setTokenCount] = useState();
  const [approvedNfts, setApprovedNfts] = useState();
 // const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [stakeDuration, setstakeDuration] = useState('30');
  const [buttonStatus, setButtonStatus] = useState();
  //const [noNfts, setNoNfts] = useState(false);
  const [loader, setLoader] = useState(true);


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
  }, [nftIds, images, tokenCount, address, buttonStatus]);

  async function approve(index) {
    const id = nftIds[index];
    console.log(id);
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "approving" }));
    try {
      const approved = await myNFTContract.approve(
        "0x000e70E0bA6652EED330C4861d4f7000D96D91aB",
        id
      );
      setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "app" }));
      await approved.wait();
      setApprovedNfts([...approvedNfts, index]);
      setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
    } catch (error) {
       if(error.code==='ACTION_REJECTED'){
        console.log("failed")
        setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "failed" }));
       }
      //setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
    }
  }

  async function stake(index) {
    const id = nftIds[index];
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "staking" }));
    try {
      const staked = await stakingContract.addStake(id, stakeDuration);
      setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: "load" }));
    await staked.wait();
    const tokencount = await myNFTContract.balanceOf(address);
    setTokenCount(tokencount.toNumber());
    setLoader(true)
    getNfts()
    setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
    } catch (error) {
      setButtonStatus((prevStatus) => ({ ...prevStatus, [index]: null }));
    }
    
  }

  async function approvednfts(nftIds) {
      if ((await myNFTContract.getApproved(nftIds)).toString() === '0x000e70E0bA6652EED330C4861d4f7000D96D91aB')
        nfts[i] = i;
      setApprovedNfts(true)
      setLoader(false)
  }
  const handleOptionChange = (event) => {
    setstakeDuration(event.target.value);
  };
  return (
    <div>
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
               
                <div>

                  {loader ?
                    <div className="loader"></div> :
                    (approvedNfts ? (
                      buttonStatus === "sta" ?
                      <div className="loader"></div> :
                      <button
                        style={{ backgroundColor: '#499bfa' }}
                        className="buttons textstyle"
                        onClick={() => stake()}
                        disabled={buttonStatus === "staking"}
                      >
                        {buttonStatus[index] === "staking" ? "Staking..." : "Stake"}
                      </button>
                    ) : (
                      buttonStatus === "app" ?
                      <div className="loader"></div> :
                      <button
                        className="buttons textstyle"
                        onClick={() => approve()}
                        disabled={buttonStatus === "approving"}
                      >
                        {buttonStatus=== "failed"? "Failed!" : buttonStatus === "approving" ? "Approving..." : "Approve"}
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}