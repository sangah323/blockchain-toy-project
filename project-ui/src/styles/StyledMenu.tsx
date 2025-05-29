import styled from "@emotion/styled";
// import { NavLink } from "react-router-dom";

export const StyledMenu = styled.nav`
  width: 300px;
  height: 100%;
  position: fixed;
  border: 1px solid red;

  a {
    font-family: "Pretendard-Medium";
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    padding: 10px 12px;
    color: #4b5563;
    transition: color 0.3s ease;
  }

  a:hover {
    color: #1f2937;
    font-weight: 700;
  }
`;
