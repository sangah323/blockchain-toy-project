import { useEffect, useState } from "react";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const useConnectWallet = () => {
  const [account, setAccount] = useState<string>("0x...");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.log("지갑 연결 실패", error);
      }
    }
  };

  useEffect(() => {
    const loadAccount = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      }
    };
    loadAccount();
  }, []);

  return {
    account,
    connectWallet,
  };
};

export default useConnectWallet;
