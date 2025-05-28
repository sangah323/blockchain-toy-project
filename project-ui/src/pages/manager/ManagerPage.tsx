import useConnectWallet from "../../hooks/useConnectWallet";
import { StyledButton } from "../../components/Button.styled";

const ManagerPage = () => {
  const { account, connectWallet } = useConnectWallet();

  // Owner(관리자) 주소와 일치하는지 확인
  const isOwner =
    account !== "0x..." &&
    account.toLowerCase() ===
      process.env.REACT_APP_OWNER_ADDRESS?.toLowerCase();

  return (
    <>
      <h1>Manager Pages</h1>
      <div>
        <StyledButton onClick={connectWallet}>지갑 연결</StyledButton>
        <p>
          {account === "0x..."
            ? "지갑을 연결하세요."
            : isOwner
            ? `접속된 관리자 지갑: ${account}`
            : "접속된 지갑은 관리자 권한이 없습니다."}
        </p>
      </div>
    </>
  );
};

export default ManagerPage;
