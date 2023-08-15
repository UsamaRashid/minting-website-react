import React, { useContext, useEffect, useState } from "react";

import { AplhabetsImages } from "./Images";
import { ContractABI, ContractAddress } from "./contractDetails";
import { ethers } from "ethers";
import NFTCard from "./NFTCard";
import { AccountContext } from "../Context/AccountContext";

const Collection = () => {
  const { account, currentChainId } = useContext(AccountContext);
  const [mintedTokens, setMintedTokens] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const fetchMintedTokens = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        ContractAddress,
        ContractABI,
        provider
      );

      const totalSupply = await contract.maxSupply();
      const tokens = [];
      for (let i = 1; i <= totalSupply; i++) {
        try {
          await contract.ownerOf(i);
          tokens.push(i);
        } catch (e) {}
      }

      setMintedTokens(tokens);
      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching minted tokens:", error);
    }
  };
  useEffect(() => {
    if (account == null || currentChainId == null) return;
    fetchMintedTokens();
  }, [account, currentChainId, loadingData]);
  const addtoMintedToken = (tokenId) => {
    setMintedTokens([...mintedTokens, tokenId]);
  };

  return (
    <div className='bg-zinc-900 p-2 '>
      <div className='text-center shadow m-3'>
        <h1 className='text-3xl bg-gradient-to-r from-teal-400 to-fuchsia-500 text-transparent bg-clip-text'>
          <span className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'>
            Alphabets
          </span>
        </h1>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-10 '>
        {AplhabetsImages.map((data) => {
          const isMinted = mintedTokens.includes(data.tokenId);
          return (
            <NFTCard
              key={data.tokenId}
              tokenId={data.tokenId}
              img={data.img}
              isMinted={isMinted}
              addtoMintedToken={addtoMintedToken}
              loadingData={loadingData}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
