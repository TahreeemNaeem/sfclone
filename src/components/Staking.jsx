import { ethers } from 'ethers';
import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Staking() {
  const [display, setDisplay] = useState(true);
  const [selectedLink, setSelectedLink] = useState("");

  const handleLinkClick = (link) => {
    setSelectedLink(link);
  };

  useEffect(() => {
    setSelectedLink(window.location.pathname);
  }, []);

  const linkStyle = (link) => {
    return selectedLink === link
      ? {
          backgroundColor: '#710707',
          borderRadius: '10px',
          border: '10px solid #710707',
          color: '#fff',
          textDecoration: 'none',
        }
      : { color: '#fff', textDecoration: 'none' };
  };

  return (
    <div>
      <div className="linkcontainer">
        <div className="linktext" onClick={() => handleLinkClick('/Nfts')}>
          <Link to="/Nfts" style={linkStyle('/Nfts')}>
            NFTs
          </Link>
        </div>
        <div className="linktext" onClick={() => handleLinkClick('/staked')}>
          <Link to="/staked" style={linkStyle('/staked')}>
            Staked NFTs
          </Link>
        </div>
      </div>
    </div>
  );
}
