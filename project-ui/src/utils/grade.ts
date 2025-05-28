// 등급 정의
export const getGrade = (grade: string) => {
  switch (grade) {
    case "0":
      return "일반회원 (NORMAL)";
    case "1":
      return "우수회원 (GOOD)";
    case "2":
      return "최우수회원 (BEST)";
    case "3":
      return "MVP회원 (EXCELLENT)";
    default:
      return;
  }
};
