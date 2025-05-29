import { useState } from "react";
import useBoardContract from "../../hooks/useBoardContract";
import { useWallet } from "../../contexts/WalletContext";
import { fetchUserInfo } from "../../utils/userInfo";
import { fetchAllPosts } from "../../utils/Post";
import UserInfoCard from "../../components/UserInfoCard";
import PostList from "../../components/PostList";
import { StyledButton } from "../../components/Button.styled";
import { StyledUser } from "../../styles/StyledManager";

// [관리자 페이지] 멤버 등록, 사용자 조회, 글 목록
const ContentsUser = () => {
  const [member, setMember] = useState(""); // 멤버 수동 등록
  const [user, setUser] = useState(""); // 사용자 검색
  const [userInfo, setUserInfo] = useState<InfoType | null>(null); // 사용자 정보
  type InfoType = {
    userAddress: string;
    isMember: boolean;
    numPosts: string;
    totalReward: string;
    grade: string;
    badgeBalances: string[];
  };
  const [postList, setPostList] = useState<PostType[]>([]); // 모든 작성 글
  type PostType = {
    content: string;
    user: string;
    timestamp: string;
  };

  const { account, connectWallet } = useWallet(); // 관리자 주소
  const { BoardAddress, BoardContract } = useBoardContract(); //   Board 컨트랙트 불러옴

  // 멤버 수동 등록
  const registerMember = async () => {
    try {
      await BoardContract.methods
        .setMember(member.toLowerCase())
        .send({ from: account });
      alert("멤버 등록 완료");
      setMember(""); // 멤버 등록 input 초기화
    } catch (error) {
      console.log(`멤버 등록 실패: ${error}`);
    }
  };

  // 사용자 정보 조회
  const checkUser = async () => {
    try {
      const info = await fetchUserInfo(BoardContract, user);
      setUserInfo(info);
    } catch (error) {
      console.log(`사용자 정보 불러오기 실패: ${error}`);
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
      <StyledUser>
        <div>
          <h2>멤버 등록</h2>
          <input
            type="text"
            value={member}
            onChange={(e) => setMember(e.target.value)}
            placeholder="멤버로 등록할 사용자의 EOA를 입력하세요."
          />
          <StyledButton onClick={registerMember}>멤버 등록</StyledButton>
        </div>
        <div>
          <h2>사용자 조회</h2>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="조회할 사용자의 EOA를 입력하세요."
          />
          <StyledButton onClick={checkUser}>사용자 조회</StyledButton>
          {userInfo && <UserInfoCard info={userInfo} />}
        </div>
        <div>
          <h2>글 목록</h2>
          <StyledButton onClick={getPosts}>글 목록</StyledButton>
          <PostList posts={postList} />
        </div>
      </StyledUser>
    </>
  );
};

export default ContentsUser;
