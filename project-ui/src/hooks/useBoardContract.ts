import Web3 from "web3";
import BoardABI from "../abi/Board.json";
import { Contract } from "web3-eth-contract";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface UseBoardContractResult {
  BoardAddress: string;
  BoardContract: Contract<typeof BoardABI.abi>;
}

const useBoardContract = (): UseBoardContractResult | undefined => {
  try {
    const web3 = new Web3(window.ethereum); // web3 인스턴스 생성

    // 실제 배포된 Board CA
    const BoardAddress = "0x89fA94648C01AD92183Dce26E059CD7603C89ABF";

    // Board 컨트랙트 인스턴스 생성
    const BoardContract = new web3.eth.Contract(
      BoardABI.abi as any[],
      BoardAddress
    );

    return { BoardAddress, BoardContract };
  } catch (error) {
    console.log(`Board 컨트랙트 연결 실패: ${error}`);
    return undefined;
  }
};

export default useBoardContract;
