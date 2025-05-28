import useBoardContract from "../../hooks/useBoardContract";
import useSTKContract from "../../hooks/useSTKContract";
import useBadgeContract from "../../hooks/useBadgeContract";
import useConnectWallet from "../../hooks/useConnectWallet";
import { StyledButton } from "../../components/Button.styled";
import { useState } from "react";

const ManagerPage = () => {
  const { account, connectWallet } = useConnectWallet(); // 관리자 주소
  const { BoardAddress, BoardContract } = useBoardContract(); //   Board 컨트랙트 불러옴
  const { STKContract } = useSTKContract(); //   STKToken 컨트랙트 불러옴
  const { BadgeContract } = useBadgeContract(); // BadgeNFT 컨트랙트 불러옴

  // Owner(관리자) 주소와 일치하는지 확인
  const isOwner =
    account !== "0x..." &&
    account.toLowerCase() ===
      process.env.REACT_APP_OWNER_ADDRESS?.toLowerCase();

  // STKToken transferOwnership(BoardAddress)
  const stkTransferOwnership = async () => {
    try {
      const newOwner = BoardAddress;
      await STKContract.methods.transferOwnership(newOwner).send({
        from: account,
      });
      alert("STKToken 소유권 이전 완료");
    } catch (error) {
      console.log(`STK 컨트랙트 권한 위임 실패: ${error}`);
    }
  };

  // BadgeNFT transferOwnership(BoardAddress)
  const badgeTransferOwnership = async () => {
    try {
      const newOwner = BoardAddress;
      await BadgeContract.methods.transferOwnership(newOwner).send({
        from: account,
      });
      alert("BadgeNFT 소유권 이전 완료");
    } catch (error) {
      console.log(`BadgeNFT 컨트랙트 권한 위임 실패: ${error}`);
    }
  };

  // STK 민팅, transferOwnership 먼저 해야 함-!
  const mintSTK = async () => {
    try {
      await BoardContract.methods.mintSTK().send({
        from: account,
      });
      alert("STK Token 민팅 완료");
    } catch (error) {
      console.log(`STK Token 민팅 실패:${error}`);
    }
  };

  return (
    <>
      <h1>Manager Pages</h1>
      <div>
        <h2>지갑 연결</h2>
        <StyledButton onClick={connectWallet}>지갑 연결</StyledButton>
        <p>
          {account === "0x..."
            ? "지갑을 연결하세요."
            : isOwner
            ? `접속된 관리자 지갑: ${account}`
            : "접속된 지갑은 관리자 권한이 없습니다."}
        </p>
      </div>
      <div>
        <h2>컨트랙트 소유권 이전</h2>
        <StyledButton onClick={stkTransferOwnership}>
          STK 소유권 이전
        </StyledButton>
        <StyledButton onClick={badgeTransferOwnership}>
          Badge 소유권 이전
        </StyledButton>
      </div>
      <div>
        <h2>STK Token 민팅</h2>
        <StyledButton onClick={mintSTK}>STK Token 민팅</StyledButton>
        <p>Total STK Token : </p>
      </div>
    </>
  );
};

export default ManagerPage;
