// UI 상 작성 글 조회
const PostList = ({ posts }: { posts: any[] }) => (
  <ul>
    {posts.map((post, index) => (
      <li key={index}>
        <p>내용 : {post.content}</p>
        <p>작성자 : {post.user}</p>
        <p>시간 : {post.timestamp}</p>
        <hr />
      </li>
    ))}
  </ul>
);

export default PostList;
