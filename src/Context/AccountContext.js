import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AccountContext = createContext();
const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [currentChainId, serCurrentChainId] = useState(null);

  const chainIdTestNet = "80001"; // Mumbai TestNet

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accountConnected = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("accountConnected", accountConnected);
        setAccount(accountConnected[0]);

        console.log("Connected to wallet");
      } catch (error) {
        toast.error(
          "Error connecting to wallet, Please Approve Metamask to Connect",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    } else {
      toast.error("Metamask is not installed", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  const switchChain = async () => {
    if (account !== null && currentChainId !== chainIdTestNet) {
      console.log("Switch chain called");
      await handleAddNetworkTestnet();
    }
  };
  useEffect(() => {
    connectWallet();
    switchChain();
  });

  const handleAddNetworkTestnet = async () => {
    console.log(
      "window.ethereum.networkVersion",
      window.ethereum.networkVersion,
      "chainIdTestNet: ",
      chainIdTestNet
    );
    console.log("handleAddNetworkTestnet called");
    if (window.ethereum.networkVersion !== chainIdTestNet) {
      console.log("Trueee");
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
        serCurrentChainId(chainIdTestNet);
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err.code === 4902) {
          await window.ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881", // 8001
                  chainName: "Mumbai",
                  nativeCurrency: {
                    name: "MATIC Token",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
                  blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
                },
              ],
            })
            .then(() => serCurrentChainId(chainIdTestNet))
            .catch((err) => {
              toast.error("User rejected the request add network", {
                position: toast.POSITION.TOP_RIGHT,
              });
              return;
            });
        } else {
          toast.error(
            "Error switching chain, Please switch to mumbai testnet",
            {
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }
      }
    } else {
      serCurrentChainId(chainIdTestNet);
    }
  };

  return (
    <AccountContext.Provider
      value={{ account, currentChainId, connectWallet, switchChain }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
