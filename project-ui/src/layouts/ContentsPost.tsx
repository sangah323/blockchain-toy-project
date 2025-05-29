// import React from "react";
import Web3 from "web3";
import { useWallet } from "../contexts/WalletContext";
import { ContentsPostList } from "../layouts/ContentsPostList";
import { StyledPost } from "../styles/StyledUser";
import useBoardContract from "../hooks/useBoardContract";
import { StyledButton } from "../components/Button.styled";
import { useState } from "react";

export const ContentsPost = () => {
  const [context, setContext] = useState(""); // 사용자 글 작성

  const { BoardContract } = useBoardContract(); // Board 컨트랙트 불러옴

  const { account } = useWallet();

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
    } catch (error) {
      console.log(`글 작성 실패: ${error}`);
    }
  };

  return (
    <StyledPost>
      <div id="postArea">
        <h2>글 작성</h2>
        <div className="post-box">
          <input
            id="context"
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
          <StyledButton onClick={post}>작성</StyledButton>
        </div>
      </div>

      <ContentsPostList />
    </StyledPost>
  );
};
