import { useState } from "react";
import { Contract } from "web3-eth-contract";
import useBoardContract from "../../hooks/useBoardContract";
import useSTKContract from "../../hooks/useSTKContract";
import useBadgeContract from "../../hooks/useBadgeContract";
import { useWallet } from "../../contexts/WalletContext";
import { fetchUserInfo } from "../../utils/userInfo";
import { fetchAllPosts } from "../../utils/Post";
import UserInfoCard from "../../components/UserInfoCard";
import PostList from "../../components/PostList";
import { StyledButton } from "../../components/Button.styled";

const ManagerPage = () => {
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
  const [totalSTK, setTotalSTK] = useState(""); // STK 총 발행량
  const [balance, setBalance] = useState(""); // STK 잔액
  const [mintEvents, setMintEvents] = useState<any[]>([]); // BadgeNFT 발급 내역

  const { account, connectWallet } = useWallet(); // 관리자 주소
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
      await stkStatus(); // STK 상태 업데이트
      alert("STK Token 민팅 완료");
    } catch (error) {
      console.log(`STK Token 민팅 실패:${error}`);
    }
  };

  // STK Token 총 발행량, 잔액
  const stkStatus = async () => {
    try {
      const total = String(await STKContract.methods.totalSupply().call());
      const bal = String(
        await STKContract.methods.balanceOf(BoardAddress).call()
      );
      setTotalSTK(total);
      setBalance(bal);
    } catch (error) {
      console.log(`STK Token 상태 조회 실패 : ${error}`);
    }
  };

  // Badge NFT 발급 내역 불러오기
  const badgeMints = async () => {
    try {
      const contract = BadgeContract as Contract<any[]>;

      // getPastEvents : 컨트랙트 이벤트 조회 메서드
      // ERC-1155에서 minting 시 자동으로 TransferSingle 이벤트 발생
      const events = await contract.getPastEvents("TransferSingle", {
        filter: { from: "0x0000000000000000000000000000000000000000" }, // from이 0이면 mint
        fromBlock: 0,
        toBlock: "latest",
      });

      // 이벤트 데이터
      const result = events.map((event: any) => ({
        to: event.returnValues.to, // Badge 발급받은 사용자
        badgeId: event.returnValues.id, // 발급받은 Badge Id
        amount: event.returnValues.value, // 발급받은 Badge 수량
        txHash: event.transactionHash, // 트랜잭션 해시
      }));

      return result;
    } catch (error) {
      console.error("Badge NFT 발급 내역 조회 실패 : ", error);
    }
  };

  // Badge NFT 발급 내역 UI에 보여주기
  const handleBadgeMints = async () => {
    const result = await badgeMints();
    if (result) setMintEvents(result);
  };

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
      <h1>Manager Pages</h1>
      <div>
        <h2>지갑 연결</h2>
        <StyledButton onClick={connectWallet}>지갑 연결</StyledButton>
        <p>
          {account === "0x..."
            ? "지갑을 연결하세요."
            : isOwner
            ? `접속된 관리자 지갑: ${account}`
            : "관리자 권한이 없는 지갑입니다."}
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
        <h2>STK Token</h2>
        <StyledButton onClick={mintSTK}>STK Token 민팅</StyledButton>
        <StyledButton onClick={stkStatus}>STK 상태</StyledButton>
        <p>총 발행량 : {totalSTK}</p>
        <p>잔액 : {balance} </p>
      </div>
      <div>
        <h2>Badge NFT</h2>
        <StyledButton onClick={handleBadgeMints}>Badge 상태</StyledButton>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {mintEvents.length === 0 ? (
            <li>발급된 배지가 없습니다.</li>
          ) : (
            mintEvents.map((mint, i) => (
              <li key={i}>
                <p>사용자 주소 : {mint.to}</p>
                <p>배지 ID : {mint.badgeId}</p>
                <p>발급 수량 : {mint.amount}</p>
                <p>트랜잭션 해시 : {mint.txHash.slice(0, 12)}...</p>
              </li>
            ))
          )}
        </ul>
      </div>
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
    </>
  );
};

export default ManagerPage;
