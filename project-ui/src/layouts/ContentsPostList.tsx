import { StyledPostList, PostListWrapper } from "../styles/StyledUser";
import PostList from "../components/PostList";

type Props = {
  postList: {
    content: string;
    user: string;
    timestamp: string;
  }[];
};

const ContentsPostList = ({ postList }: Props) => {
  return (
    <StyledPostList>
      <h2>글 목록</h2>
      <PostListWrapper>
        <PostList posts={postList} />
      </PostListWrapper>
    </StyledPostList>
  );
};

export default ContentsPostList;
