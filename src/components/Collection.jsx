import React, { useEffect, useState } from "react";

import { AplhabetsImages } from "./Images";
import { ContractABI, ContractAddress } from "./contractDetails";
import { ethers } from "ethers";
import NFTCard from "./NFTCard";

const Collection = () => {
  const [mintedTokens, setMintedTokens] = useState([]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected to wallet");
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("Metamask is not installed");
    }
  };

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
        } catch (e) {
          //   console.log("ee", e);
        }
      }

      setMintedTokens(tokens);
      console.log("Tokens", tokens);
    } catch (error) {
      console.error("Error fetching minted tokens:", error);
    }
  };
  useEffect(() => {
    connectWallet();
    fetchMintedTokens();
  }, []);
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
