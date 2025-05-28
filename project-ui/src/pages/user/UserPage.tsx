import { useState } from "react";
import Web3 from "web3";
import useConnectWallet from "../../hooks/useConnectWallet";
import useBoardContract from "../../hooks/useBoardContract";
import { fetchUserInfo } from "../../utils/userInfo";
import { fetchAllPosts } from "../../utils/Post";
import UserInfoCard from "../../components/UserInfoCard";
import PostList from "../../components/PostList";
import { StyledButton } from "../../components/Button.styled";

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
      checkMy(); // 내 정보 업데이트
    } catch (error) {
      console.log(`글 작성 실패: ${error}`);
    }
  };

  // 모든 작성 글 조회
  const getPosts = async () => {
    try {
      const posts = await fetchAllPosts(BoardContract);
      setPostList(posts);
    } catch (error) {
      console.log(`전체 글 조회 실패 : ${error}`);
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
        <StyledButton onClick={getPosts}>글 목록</StyledButton>
        <PostList posts={postList} />
      </div>
    </>
  );
};

export default UserPage;
