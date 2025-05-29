import { StyledWallet } from "../styles/StyledUser";
import { useWallet } from "../contexts/WalletContext";
import { StyledButton } from "../components/Button.styled";

const circle = "./circle.png";

export const ContentsWallet = () => {
  const { account, connectWallet } = useWallet(); // 지갑 연결

  return (
    <StyledWallet id="connect">
      <img
        className="circle-img"
        src={circle}
        alt="지갑 연결 회색 원 이미지"
      ></img>
      <div>
        <h2>지갑 연결</h2>
        <StyledButton onClick={connectWallet}>지갑 연결</StyledButton>
        <p className="account">
          {account !== "0x..." ? account : "지갑을 연결하세요."}
        </p>
      </div>
    </StyledWallet>
  );
};
