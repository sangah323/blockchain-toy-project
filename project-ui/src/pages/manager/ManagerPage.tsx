import ContentsUser from "../../layouts/Manager/ContentsUser";
import ContentsContract from "../../layouts/Manager/ContentsContract";
import { StyledManager } from "../../styles/StyledManager";

const ManagerPage = () => {
  return (
    <>
      <StyledManager>
        <ContentsContract />
        <ContentsUser />
      </StyledManager>
    </>
  );
};

export default ManagerPage;
