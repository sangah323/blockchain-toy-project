import useConnectWallet from "../../hooks/useConnectWallet";
import useBoardContract from "../../hooks/useBoardContract";
import { StyledButton } from "../../components/Button.styled";
import { useState } from "react";

const UserPage = () => {
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

  const getGradeLabel = (grade: string) => {
    // 등급 정의
    switch (grade) {
      case "0":
        return "일반회원";
      case "1":
        return "우수회원";
      case "2":
        return "최우수회원";
      case "3":
        return "MVP";
      default:
        return;
    }
  };

  // 내 정보 확인
  const checkMyInfo = async () => {
    if (!account || account === "0x...") {
      alert("지갑 먼저 연결하세요.");
      return;
    }

    try {
      const result = (await BoardContract.methods
        .getUserInfo(account)
        .call()) as [
        string, // userAddress
        boolean, // isMember
        bigint, // numPosts
        bigint, // totalReward
        number, // grade
        bigint[] // badgeBalances];
      ];

      const info: InfoType = {
        userAddress: result[0],
        isMember: result[1],
        numPosts: result[2].toString(),
        totalReward: result[3].toString(),
        grade: result[4].toString(),
        badgeBalances: result[5].map((n: any) => n.toString()),
      };

      setMyInfo(info);
    } catch (error) {
      console.log(`내 정보 불러오기 실패: ${error}`);
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
        <StyledButton onClick={checkMyInfo}>내 정보</StyledButton>
        {myInfo && (
          <div>
            <p>주소: {myInfo.userAddress}</p>
            <p>멤버 여부: {myInfo.isMember ? "등록" : "미등록"}</p>
            <p>작성한 글 수: {myInfo.numPosts}</p>
            <p>누적 보상: {myInfo.totalReward} STK</p>
            <p>현재 등급: {getGradeLabel(myInfo.grade)}</p>
            <p>
              배지 보유량:
              <ul>
                <li>GOOD: {myInfo.badgeBalances[0]}</li>
                <li>BEST: {myInfo.badgeBalances[1]}</li>
                <li>MVP: {myInfo.badgeBalances[2]}</li>
              </ul>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserPage;
