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

const useSTKContract = (): UseSTKContractResult | undefined => {
  try {
    const web3 = new Web3(window.ethereum); // web3 인스턴스 생성

    // 실제 배포된 STKToken CA
    const STKAddress = "0x959011c81e1da662F42CDCda0e778043B1C98d3e";

    // STKToken 컨트랙트 인스턴스 생성
    const STKContract = new web3.eth.Contract(
      STKTokenABI.abi as any[],
      STKAddress
    );

    return { STKContract };
  } catch (error) {
    console.log(`STKToken 컨트랙트 연결 실패: ${error}`);
    return undefined;
  }
};

export default useSTKContract;
