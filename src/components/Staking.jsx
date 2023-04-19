import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Staking() {
  const [selectedLink, setSelectedLink] = useState("/Nfts");
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setSelectedLink(link);
    navigate(link);
  };

  useEffect(() => {
    setSelectedLink(window.location.pathname);
    if (!selectedLink || selectedLink === '/'|| window.location.pathname==='/') {
      handleLinkClick('/Nfts');
    }
  },);

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
      <div className="linkcontainer textstyle">
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
