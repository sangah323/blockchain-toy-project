import styled from "@emotion/styled";

export const StyledMenu = styled.nav`
  width: 240px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 40px 20px;
  background-color: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.03);

  a {
    font-family: "Pretendard-Medium";
    text-decoration: none;
    font-size: 20px;
    color: #6b7280;
    padding: 10px 16px;
    border-radius: 8px;
    transition: background 0.2s, color 0.2s;

    &.active {
      background-color: #e5e7eb;
      color: #111827;
      font-weight: 700;
    }

    &:hover {
      background-color: #e5e7eb;
      color: #111827;
    }
  }

  #manager {
    position: absolute;
    bottom: 130px;
    right: 30px;
  }
`;
