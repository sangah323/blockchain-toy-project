import { createContext, useContext } from "react";
import useConnectWallet from "../hooks/useConnectWallet";

type WalletContextType = {
  account: string;
  connectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { account, connectWallet } = useConnectWallet();

  return (
    <WalletContext.Provider value={{ account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
