import { Outlet } from "react-router-dom";
import UserMenu from "./UserMenu";

const Layout = () => {
  return (
    <div className="app-container">
      <UserMenu /> {/* 항상 보일 메뉴 */}
      <Outlet /> {/* Outlet으로 라우팅된 페이지 렌더링 */}
    </div>
  );
};

export default Layout;
