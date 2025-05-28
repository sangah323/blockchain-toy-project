import styled from "styled-components";

export const StyledButton = styled.button`
  padding: 10px 16px;
  font-size: 16px;
  background-color: #4b5563;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background-color: #1f2937;
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;
