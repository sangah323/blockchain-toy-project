import { Link } from "react-router-dom";
import { useWallet } from "../../contexts/WalletContext";
import { StyledConnect } from "../../styles/StyledManager";
import { StyledButton } from "../../components/Button.styled";

const ConnectWalletPage = () => {
  const { account, connectWallet } = useWallet(); // 관리자 주소

  // Owner(관리자) 주소와 일치하는지 확인
  const isOwner =
    account !== "0x..." &&
    account.toLowerCase() ===
      process.env.REACT_APP_OWNER_ADDRESS?.toLowerCase();

  return (
    <>
      <StyledConnect>
        <p>
          {account === "0x..." ? (
            <div>
              <StyledButton onClick={connectWallet}>지갑 연결</StyledButton>
              <h2>지갑을 연결하세요.</h2>
            </div>
          ) : isOwner ? (
            <div className="admin">
              <div>
                <h4>연결된 관리자 지갑 :</h4>
                <h3>${account}</h3>
              </div>
              <Link to="/manager">관리자 화면으로 이동</Link>
            </div>
          ) : (
            <div className="no-admin">
              <div>⚠️</div>
              <h3>관리자 권한이 없는 지갑입니다.</h3>
              <Link to="/">메인 화면으로 이동</Link>
            </div>
          )}
        </p>
      </StyledConnect>
    </>
  );
};

export default ConnectWalletPage;
