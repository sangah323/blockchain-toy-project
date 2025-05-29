import { StyledPostList } from "../styles/StyledUser";
import useBoardContract from "../hooks/useBoardContract";
import { fetchAllPosts } from "../utils/Post";
import PostList from "../components/PostList";
import { StyledButton } from "../components/Button.styled";
import { useState } from "react";

export const ContentsPostList = () => {
  const [postList, setPostList] = useState<PostType[]>([]); // 모든 작성 글
  type PostType = {
    content: string;
    user: string;
    timestamp: string;
  };

  const { BoardContract } = useBoardContract(); // Board 컨트랙트 불러옴

  // 모든 작성 글 조회
  const getPosts = async () => {
    try {
      const posts = await fetchAllPosts(BoardContract);
      setPostList(posts);
    } catch (error) {
      console.log(`전체 글 조회 실패 : ${error}`);
    }
  };

  return (
    <StyledPostList>
      <div>
        <h2>글 목록</h2>
        <StyledButton onClick={getPosts}>글 목록</StyledButton>
        <PostList posts={postList} />
      </div>
    </StyledPostList>
  );
};
