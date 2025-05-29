import { Outlet } from "react-router-dom";
import UserMenu from "./UserMenu";

const Layout = () => {
  return (
    <div style={{ display: "flex" }}>
      <UserMenu />
      <main style={{ marginLeft: "240px", padding: "40px", flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
