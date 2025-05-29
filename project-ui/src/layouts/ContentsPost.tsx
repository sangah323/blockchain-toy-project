import { useState } from "react";
import Web3 from "web3";
import { useWallet } from "../contexts/WalletContext";
import { StyledPost } from "../styles/StyledUser";
import { StyledButton } from "../components/Button.styled";
import useBoardContract from "../hooks/useBoardContract";

const ContentsPost = ({ onPost }: { onPost: () => void }) => {
  const [context, setContext] = useState(""); // 사용자 글 작성
  const { account } = useWallet(); // 주소 불러옴
  const { BoardContract } = useBoardContract(); // Board 컨트랙트 불러옴

  const post = async () => {
    if (!context || context.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum); // 인스턴스 생성

      // 글 작성 시 0.5 ETH 보내야 됨
      await BoardContract.methods
        .postMessage(context.toString())
        .send({ from: account, value: web3.utils.toWei("0.5", "ether") });
      alert("글 등록 완료. 글 등록 보상을 확인해주세요.");
      setContext(""); // input 초기화
      onPost(); // 글 목록 다시 불러오기
    } catch (error) {
      console.log(`글 작성 실패: ${error}`);
    }
  };

  return (
    <StyledPost>
      <div className="post-box">
        <input
          id="context"
          type="text"
          value={context}
          placeholder="메세지를 작성해주세요."
          onChange={(e) => setContext(e.target.value)}
        />
        <StyledButton onClick={post}>작성</StyledButton>
      </div>
    </StyledPost>
  );
};

export default ContentsPost;
