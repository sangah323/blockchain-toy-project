// 사용자 정보 조회
export const fetchUserInfo = async (BoardContract: any, address: string) => {
  const result = (await BoardContract.methods.getUserInfo(address).call()) as [
    string, // userAddress
    boolean, // isMember
    string, // numPosts
    string, // totalReward
    number, // grade
    string[] // badgeBalances;
  ];

  return {
    userAddress: result[0],
    isMember: result[1],
    numPosts: result[2].toString(),
    totalReward: result[3].toString(),
    grade: result[4].toString(),
    badgeBalances: result[5].map((b: any) => b.toString()),
  };
};
