import styled from "@emotion/styled";

export const StyledConnect = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #9ca3af;
  border-radius: 10px;
  box-sizing: border-box;

  .admin {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;

    h3 {
      color: #4b5563;
    }
    a {
      font-size: 24px;
      color: black;
      font-weight: 800;
    }
  }

  .no-admin {
    display: flex;
    flex-direction: column;
    align-items: center;

    div {
      font-size: 50px;
    }
    a {
      margin-top: 30px;
      font-size: 24px;
      font-weight: 800;
      color: red;
    }
  }
`;
export const StyledManager = styled.div`
  margin: 0 auto;
  display: flex;
  gap: 50px;
  align-items: center;
`;

export const StyledUser = styled.div`
  max-width: 1200px;
  min-height: 600px;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #9ca3af;
  border-radius: 10px;
  box-sizing: border-box;

  input {
    width: 800px;
    height: 35px;
  }
`;

export const StyledContract = styled.div`
  max-width: 1200px;
  min-height: 600px;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #9ca3af;
  border-radius: 10px;
  box-sizing: border-box;
`;
