import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import { WalletProvider } from "./contexts/WalletContext";
import UserPage from "./pages/User/UserPage";
import MyInfo from "./pages/User/MyInfo";
import ConnectWalletPage from "./pages/Manager/ConnectWalletPage";
import ManagerPage from "./pages/Manager/ManagerPage";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          {/* 기본 루트로 들어가도 /user로 이동하기*/}
          <Route path="/" element={<Navigate to="/user" />} />

          {/* 공통 Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="/user" element={<UserPage />} />
            <Route path="/myInfo" element={<MyInfo />} />
            <Route path="/connect" element={<ConnectWalletPage />} />
            <Route path="/manager" element={<ManagerPage />} />
          </Route>
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
