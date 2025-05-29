import { getGrade } from "../utils/grade";
import { StyledInfoCard } from "../styles/StyledUser";

// UI 상 사용자 정보 조회
const UserInfoCard = ({ info }: { info: any }) => (
  <StyledInfoCard>
    <p>주소: {info.userAddress}</p>
    <p>멤버 여부: {info.isMember ? "등록" : "미등록"}</p>
    <p>작성 글 수: {info.numPosts}</p>
    <p>누적 보상: {info.totalReward} STK</p>
    <p>등급: {getGrade(info.grade)}</p>
    <p>
      배지 보유량:
      <ul>
        <li>GOOD: {info.badgeBalances[0]}</li>
        <li>BEST: {info.badgeBalances[1]}</li>
        <li>MVP: {info.badgeBalances[2]}</li>
      </ul>
    </p>
  </StyledInfoCard>
);
export default UserInfoCard;
