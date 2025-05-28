import Web3 from "web3";
import STKTokenABI from "../abi/STKToken.json";
import { Contract } from "web3-eth-contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UseSTKContractResult {
  STKContract: Contract<typeof STKTokenABI.abi>;
}

const useSTKContract = (): UseSTKContractResult => {
  const web3 = new Web3(window.ethereum); // web3 인스턴스 생성

  // 실제 배포된 STKToken CA
  const STKAddress = "0x3d642d427D801d80051eac50c191c9288E28fb0c";

  // STKToken 컨트랙트 인스턴스 생성
  const STKContract = new web3.eth.Contract(
    STKTokenABI.abi as any[],
    STKAddress
  );

  return { STKContract };
};

export default useSTKContract;
