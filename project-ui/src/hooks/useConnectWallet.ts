// 더 이상 useState 쓰지 않음!
const useConnectWallet = () => {
  const connectWallet = async (): Promise<string | null> => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } else {
      alert("메타마스크가 설치되어 있지 않습니다.");
      return null;
    }
  };

  return { connectWallet };
};

export default useConnectWallet;
