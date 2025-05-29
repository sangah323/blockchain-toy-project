import { useEffect, useState } from "react";
import { useWallet } from "../../contexts/WalletContext";
import useBoardContract from "../../hooks/useBoardContract";
import { fetchUserInfo } from "../../utils/userInfo";
import UserInfoCard from "../../components/UserInfoCard";
import { StyledInfo } from "../../styles/StyledUser";

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

  // 내 정보 조회
  useEffect(() => {
    const fetch = async () => {
      if (!account || account === "0x...") return; // 주소 바뀌면 실행 안 되도록

      try {
        const info = await fetchUserInfo(BoardContract, account);
        setMyInfo(info);
      } catch (error) {
        console.log(`사용자 정보 불러오기 실패 : ${error}`);
      }
    };

    fetch();
  }, [account, BoardContract]); // account 바뀌면 다시 실행

  return (
    <StyledInfo>
      <h2>내 정보</h2>
      {/* <StyledButton onClick={checkMyInfo}>내 정보</StyledButton> */}
      {myInfo ? (
        <UserInfoCard info={myInfo} />
      ) : (
        <p>사용자 정보를 불러오는 중입니다..</p>
      )}
    </StyledInfo>
  );
};

export default MyInfo;
