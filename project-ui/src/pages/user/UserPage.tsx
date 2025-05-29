import { useState, useEffect } from "react";
import { ContentsWallet } from "../../layouts/ContentsWallet";
import ContentsPost from "../../layouts/ContentsPost";
import ContentsPostList from "../../layouts/ContentsPostList";
import useBoardContract from "../../hooks/useBoardContract";
import { fetchAllPosts } from "../../utils/Post";

type PostType = {
  content: string;
  user: string;
  timestamp: string;
};

const UserPage = () => {
  const [postList, setPostList] = useState<PostType[]>([]);
  const { BoardContract } = useBoardContract();

  // 글 목록 불러옴
  const fetchPosts = async () => {
    try {
      const posts = await fetchAllPosts(BoardContract);
      setPostList(posts);
    } catch (error) {
      console.log("글 목록 조회 실패:", error);
    }
  };

  // 컴포넌트 마운드 시 목록 재랜더링
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <ContentsWallet />
      {/* 글 작성 컴포넌트에 콜백 props 전달 */}
      <ContentsPost onPost={fetchPosts} />
      {/* 최신 글 목록을 props로 전달 */}
      <ContentsPostList postList={postList} />
    </>
  );
};

export default UserPage;
