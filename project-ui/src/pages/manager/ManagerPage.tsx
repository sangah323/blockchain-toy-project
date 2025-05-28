import useBoardContract from "../../hooks/useBoardContract";
import useSTKContract from "../../hooks/useSTKContract";
import useBadgeContract from "../../hooks/useBadgeContract";
import useConnectWallet from "../../hooks/useConnectWallet";
import { StyledButton } from "../../components/Button.styled";
import { useState } from "react";
import { Contract } from "web3-eth-contract";

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

  const { account, connectWallet } = useConnectWallet(); // 관리자 주소
  const { BoardAddress, BoardContract } = useBoardContract(); //   Board 컨트랙트 불러옴
  const { STKContract } = useSTKContract(); //   STKToken 컨트랙트 불러옴
  const { BadgeContract } = useBadgeContract(); // BadgeNFT 컨트랙트 불러옴

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

  // 사용자 정보 확인
  const checkUserInfo = async () => {
    if (!account || account === "0x...") {
      alert("관리자 지갑으로 먼저 연결해주세요.");
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

      setUserInfo(info); // 사용자 정보 업데이트
      setUser(""); // 사용자 검색 input 초기화
    } catch (error) {
      console.log(`내 정보 불러오기 실패: ${error}`);
    }
  };

  // 모든 작성 글
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
          placeholder="멤버로 인정할 사용자의 EOA를 입력하세요."
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
        <StyledButton onClick={checkUserInfo}>조회</StyledButton>
      </div>
      {userInfo && (
        <div>
          <p>주소: {userInfo.userAddress}</p>
          <p>멤버 여부: {userInfo.isMember ? "등록" : "미등록"}</p>
          <p>작성한 글 수: {userInfo.numPosts}</p>
          <p>누적 보상: {userInfo.totalReward} STK</p>
          <p>현재 등급: {getGradeLabel(userInfo.grade)}</p>
          <p>
            배지 보유량:
            <ul>
              <li>GOOD: {userInfo.badgeBalances[0]}</li>
              <li>BEST: {userInfo.badgeBalances[1]}</li>
              <li>MVP: {userInfo.badgeBalances[2]}</li>
            </ul>
          </p>
        </div>
      )}
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

export default ManagerPage;
