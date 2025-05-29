import { NavLink } from "react-router-dom";
import { StyledMenu } from "../styles/StyledMenu";

const UserMenu = () => {
  return (
    <StyledMenu>
      <NavLink to="/user">메인</NavLink>
      <NavLink to="/myInfo">내 정보</NavLink>
      <NavLink to="/connect" id="manager">
        관리자 전용
      </NavLink>
    </StyledMenu>
  );
};

export default UserMenu;
