import { createContext, useContext, useEffect, useState } from "react";
// import useConnectWallet from "../hooks/useConnectWallet";

type WalletContextType = {
  account: string;
  connectWallet: () => Promise<void>;
};

// Context 생성, 초기 undefined
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Context Provider 컴포넌트
export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState("0x...");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("메타마스크가 설치되어 있지 않습니다.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);

        window.ethereum.on("accountsChanged", (newAccounts: string[]) => {
          if (newAccounts.length > 0) {
            setAccount(newAccounts[0]);
          } else {
            setAccount("0x...");
          }
        });
      }
    } catch (error) {
      console.error(`지갑 연결 실패 : ${error}`);
    }
  };

  return (
    <WalletContext.Provider value={{ account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

// Context 사용 가능하게 해주는 Hook
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
