import React, { useEffect, useState } from "react";

import { AplhabetsImages } from "./Images";
import { ContractABI, ContractAddress } from "./contractDetails";
import { Contract, ethers } from "ethers";

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
          const owner = await contract.ownerOf(i);
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

  const mintToken = async (tokenId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("signer", (await signer).address);
      console.log("Tokenid", tokenId);

      const contract = new ethers.Contract(
        ContractAddress,
        ContractABI,
        signer
      );
      const cost = await contract.cost();

      const tx = await contract.mint(tokenId, {
        value: cost,
      });
      await tx.wait();
      console.log("Token minted successfully");
    } catch (error) {
      console.error("Error minting token:", error);
    }
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
            <div
              key={data.tokenId}
              className='w-[fit-content] h-[fit-content] rounded-2xl overflow-hidden relative'
            >
              <img className='' src={data.img} alt={data.tokenId} />

              <div className=' hover:backdrop-blur-sm bg-opacity-40 overlay absolute inset-0 flex items-center justify-center hover:bg-gradient-to-r hover:from-teal-400 hover:to-fuchsia-500 hover:text-transparent hover:bg-clip-text'>
                {isMinted ? (
                  <h4 className='text-transparent text-3xl'>
                    <span className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                      Already Minted
                    </span>
                  </h4>
                ) : (
                  <button
                    onClick={() => {
                      console.log("Mint Button Clicked", data.tokenId);
                      mintToken(data.tokenId);
                    }}
                    className='text-transparent mint-button bg-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-fuchsia-500 hover:text-transparent hover:bg-clip-text'
                  >
                    <h4 className='text-3xl'>
                      <span className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                        Mint
                      </span>
                    </h4>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Collection;
