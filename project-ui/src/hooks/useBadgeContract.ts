import Web3 from "web3";
import BadgeNFTABI from "../abi/BadgeNFT.json";
import { Contract } from "web3-eth-contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UseBadgeContractResult {
  BadgeContract: Contract<typeof BadgeNFTABI.abi>;
}

const useBadgeContract = (): UseBadgeContractResult => {
  const web3 = new Web3(window.ethereum); // web3 인스턴스 생성

  // 실제 배포된 STKToken CA
  const BadgeAddress = "0xCf7B0CAAb68E18041cf3c9B3569B96363da95a23";

  // STKToken 컨트랙트 인스턴스 생성
  const BadgeContract = new web3.eth.Contract(
    BadgeNFTABI.abi as any[],
    BadgeAddress
  );

  return { BadgeContract };
};

export default useBadgeContract;
