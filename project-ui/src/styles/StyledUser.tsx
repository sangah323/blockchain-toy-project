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

export const StyledInfoCard = styled.div`
  flex: 1;
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);

  h3 {
    font-size: 28px;
    margin-bottom: 20px;
    font-weight: 700;
    color: #1f2937;
  }

  p {
    margin: 10px 0;
    font-size: 18px;
    color: #374151;
  }

  ul {
    margin-top: 10px;
    padding-left: 20px;
  }

  li {
    font-size: 16px;
    color: #6b7280;
    line-height: 1.6;
  }
`;
