import { useEffect, useState } from "react";
// import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const useConnectWallet = () => {
  const [account, setAccount] = useState("0x...");

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      alert("메타마스크가 설치되어 있지 않습니다.");
    }
  };

  // 주소 변경 감지 후 재랜더
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount("0x...");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  return { account, connectWallet };
};

export default useConnectWallet;
