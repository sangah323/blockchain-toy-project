import useConnectWallet from "../../hooks/useConnectWallet";
import useBoardContract from "../../hooks/useBoardContract";
import { StyledButton } from "../../components/Button.styled";
import { useState } from "react";
import Web3 from "web3";

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
  const [context, setContext] = useState(""); // 사용자 글 작성
  const [postList, setPostList] = useState<PostType[]>([]); // 모든 작성 글
  type PostType = {
    content: string;
    user: string;
    timestamp: string;
  };

  const { account, connectWallet } = useConnectWallet(); // 지갑 연결
  const { BoardContract } = useBoardContract(); // Board 컨트랙트 불러옴

  // 등급 정의
  const getGradeLabel = (grade: string) => {
    switch (grade) {
      case "0":
        return "일반회원(NOMAL)";
      case "1":
        return "우수회원 (GOOD)";
      case "2":
        return "최우수회원 (BEST)";
      case "3":
        return "MVP회원 (EXCELLENT)";
      default:
        return;
    }
  };

  // 내 정보 확인
  const checkMyInfo = async () => {
    if (!account || account === "0x...") {
      alert("지갑을 먼저 연결해주세요.");
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

  const post = async () => {
    if (!account || account === "0x...") {
      alert("지갑을 먼저 연결해주세요.");
      return;
    }

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
      checkMyInfo(); // 내 정보 업데이트
    } catch (error) {
      console.log(`글 작성 실패: ${error}`);
    }
  };

  const allPost = async () => {
    try {
      const posts: PostType[] = [];
      const totalPosts = await BoardContract.methods.getPostCount().call(); // 총 글 개수

      for (let i = 0; i < Number(totalPosts); i++) {
        try {
          const post = (await BoardContract.methods.getAllPosts(i).call()) as [
            string, // content
            string, // user
            string // timestamp
          ];

          posts.push({
            content: post[0],
            user: post[1],
            timestamp: new Date(Number(post[2]) * 1000).toLocaleString(), // UNIX 타임 → 문자열
          });
        } catch (error) {
          console.log(`글 ${i} 조회 실패: ${error}`);
        }
      }

      setPostList(posts); // 상태 업데이트
    } catch (error) {
      console.log("글 목록 전체 불러오기 실패:", error);
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
      <div>
        <h2>글 작성</h2>
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <StyledButton onClick={post}>작성</StyledButton>
      </div>
      <div>
        <h2>글 목록</h2>
        <StyledButton onClick={allPost}>글 목록</StyledButton>
        <ul>
          {postList.map((post, index) => (
            <li key={index}>
              <p>내용: {post.content}</p>
              <p>작성자: {post.user}</p>
              <p>작성시간: {post.timestamp}</p>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default UserPage;
