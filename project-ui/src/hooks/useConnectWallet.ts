import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const useConnectWallet = () => {
  const [account, setAccount] = useState<string>("0x...");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask가 설치되어 있지 않습니다.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (err) {
      console.error("지갑 연결 실패:", err);
    }
  };

  return {
    account,
    connectWallet,
  };
};

export default useConnectWallet;
