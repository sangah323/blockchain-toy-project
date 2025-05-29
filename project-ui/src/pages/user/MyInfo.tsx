import { useState } from "react";
import { useWallet } from "../../contexts/WalletContext";
import useBoardContract from "../../hooks/useBoardContract";
import { fetchUserInfo } from "../../utils/userInfo";
import UserInfoCard from "../../components/UserInfoCard";
import { StyledInfo } from "../../styles/StyledUser";
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

  const { account } = useWallet();
  const { BoardContract } = useBoardContract(); // Board 컨트랙트 불러옴

  console.log("account", account);

  // 내 정보 조회
  const checkMyInfo = async () => {
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
    <StyledInfo>
      <h2>내 정보</h2>
      <StyledButton onClick={checkMyInfo}>내 정보</StyledButton>
      {myInfo && <UserInfoCard info={myInfo} />}
    </StyledInfo>
  );
};

export default MyInfo;
