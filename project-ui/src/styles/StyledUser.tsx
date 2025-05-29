import styled from "@emotion/styled";

export const StyledWallet = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  display: flex;
  gap: 100px;
  border: 1px solid #9ca3af;
  border-radius: 10px;
  box-sizing: border-box;

  .circle-img {
    width: 200px;
    height: 200px;
  }
  .account {
    font-size: 24px;
    font-weight: 700;
    color: #4b5563;
  }
`;

export const StyledPost = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #9ca3af;
  border-radius: 10px;
  box-sizing: border-box;

  #postArea {
    margin: 0 auto;
    /* border: 1px solid #9ca3af; */
    border-radius: 10px;
  }

  .post-box {
    display: flex;
    gap: 30px;
  }

  #context {
    width: 1000px;
    height: 100px;
  }
`;

export const StyledPostList = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
  /* padding: 20px; */
  border-top: 2px solid #9ca3af;

  .post-box {
    display: flex;
    gap: 30px;
  }

  #context {
    width: 1000px;
    height: 100px;
  }
`;

export const PostListWrapper = styled.div`
  ul {
    padding: 0;
    list-style: none;
  }

  li {
    background: #eef1f6;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 10px;
    transition: all 0.3s;
  }

  li:hover {
    background: #dde4ec;
  }
`;

export const StyledInfo = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  gap: 50px;
  border: 1px solid #9ca3af;
  border-radius: 10px;
`;
