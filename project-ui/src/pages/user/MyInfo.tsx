import { useState } from "react";
import Web3 from "web3";
import useConnectWallet from "../../hooks/useConnectWallet";
import useBoardContract from "../../hooks/useBoardContract";
import { fetchUserInfo } from "../../utils/userInfo";
import UserInfoCard from "../../components/UserInfoCard";
import { StyledButton } from "../../components/Button.styled";

const MyInfo = () => {
  const [myInfo, setMyInfo] = useState<InfoType | null>(null); // 내 정보
  type InfoType = {
    userAddress: string;
    isMember: boolean;
    numPosts: string;
    totalReward: string;
    grade: string;
    badgeBalances: string[];
  };

  const { account, connectWallet } = useConnectWallet(); // 지갑 연결
  const { BoardContract } = useBoardContract(); // Board 컨트랙트 불러옴

  // 내 정보 조회
  const checkMy = async () => {
    if (!account || account === "0x...") {
      alert("지갑을 먼저 연결해주세요.");
      return;
    }
    try {
      const info = await fetchUserInfo(BoardContract, account);
      setMyInfo(info);
    } catch (error) {
      console.log(`사용자 정보 불러오기 실패: ${error}`);
    }
  };

  return (
    <>
      <h1>User Page</h1>
      <div>
        <h2>지갑 연결</h2>
        <StyledButton onClick={connectWallet}>지갑 연결</StyledButton>
        <p>{account !== "0x..." ? account : "지갑을 연결하세요."}</p>
      </div>
      <div>
        <h2>내 정보</h2>
        <StyledButton onClick={checkMy}>내 정보</StyledButton>
        {myInfo && <UserInfoCard info={myInfo} />}
      </div>
    </>
  );
};

export default MyInfo;
