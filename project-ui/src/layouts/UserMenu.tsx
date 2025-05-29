import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { StyledMenu } from "../styles/StyledMenu";

const UserMenu = () => {
  return (
    <StyledMenu>
      <NavLink to="/user">메인</NavLink>
      <NavLink to="/myInfo">내 정보</NavLink>
    </StyledMenu>
  );
};

export default UserMenu;
