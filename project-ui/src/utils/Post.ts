// 누적 작성 글
export const fetchAllPosts = async (contract: any) => {
  const total = await contract.methods.getPostCount().call(); // 누적 글 수
  const posts = [];

  for (let i = 0; i < Number(total); i++) {
    const post = (await contract.methods.getAllPosts(i).call()) as [
      string, // content
      string, // user
      string // timestamp
    ];
    posts.push({
      content: post[0],
      user: post[1],
      timestamp: new Date(Number(post[2]) * 1000).toLocaleString(),
    });
  }

  return posts;
};
