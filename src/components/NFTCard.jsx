import { useContext, useState } from "react";
import { ethers } from "ethers";
import { ContractABI, ContractAddress } from "./contractDetails";
import { toast } from "react-toastify";
import { AccountContext } from "../Context/AccountContext";
const NFTCard = ({ tokenId, img, isMinted, addtoMintedToken, loadingData }) => {
  const [enteredName, setEnteredName] = useState("");
  const { account, currentChainId, connectWallet, switchChain } =
    useContext(AccountContext);

  const handleNameChange = (event) => {
    setEnteredName(event.target.value);
  };

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

      const tx = await contract.mint(tokenId, enteredName, {
        value: cost,
      });
      await tx.wait();
      toast.success('"Token minted successfully"', {
        position: toast.POSITION.TOP_RIGHT,
      });
      addtoMintedToken(tokenId);
    } catch (e) {
      console.error("e:", { ...e });
      toast.error(e.info.error.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  console.log("CARD:Account", account);
  console.log("CARD:currentChainId", currentChainId);

  return (
    <div
      key={tokenId}
      className='w-[fit-content] h-[fit-content] rounded-2xl overflow-hidden relative'
    >
      <img className='' src={img} alt={tokenId} />

      <div className=' hover:backdrop-blur-sm bg-opacity-40 overlay absolute inset-0 flex items-center justify-center hover:bg-gradient-to-r hover:from-teal-400 hover:to-fuchsia-500 hover:text-transparent hover:bg-clip-text'>
        {!account || !currentChainId ? (
          !account ? (
            <h4 className='text-transparent  text-center text-3xl '>
              <span
                className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
                onClick={connectWallet}
              >
                Connect Metamask
              </span>
            </h4>
          ) : !currentChainId ? (
            <h4 className='text-transparent  text-center text-3xl '>
              <span
                className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
                onClick={switchChain}
              >
                Switch Network
              </span>
            </h4>
          ) : (
            <div>None</div>
          )
        ) : loadingData ? (
          <h4 className='text-transparent text-2xl'>
            <span className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
              Loading...{" "}
            </span>
          </h4>
        ) : isMinted ? (
          <h4 className='text-transparent text-center text-2xl'>
            <span className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
              Already Minted
            </span>
          </h4>
        ) : (
          <div className='flex flex-col items-center py-4  '>
            <input
              placeholder='Enter your name'
              type='text'
              value={enteredName}
              onChange={handleNameChange}
              className='text-center placeholder:text-transparent  rounded-md p-3 bg-inherit text-transparent hover:bg-transparent hover:bg-clip-text hover:text-white'
            />
            <button
              onClick={() => {
                console.log("Mint Button Clicked", tokenId);
                if (
                  enteredName.charAt(0).toUpperCase() ===
                  String.fromCharCode(96 + tokenId)
                ) {
                  mintToken(tokenId);
                } else {
                  toast.error(
                    `Enter a valid name starting with same letter '${String.fromCharCode(
                      64 + tokenId
                    )}'`,
                    {
                      position: toast.POSITION.TOP_RIGHT,
                    }
                  );
                }
              }}
              className='text-transparent hover:bg-gradient-to-r hover:from-teal-400 hover:to-fuchsia-500  hover:bg-clip-text'
            >
              <h4 className='text-3xl'>
                <span className='text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                  Mint
                </span>
              </h4>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTCard;
