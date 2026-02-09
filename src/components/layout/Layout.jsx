import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SideNav from "./Sidebar";
import TopNav from "./TopNav";

export default function Layout() {
  const [width, setWidth] = useState(260);
  const location = useLocation();

  const hideLayout = location.pathname === "/login";

  return (
    <div id="app">
      {!hideLayout && <SideNav width={width} setWidth={setWidth} />}

      <div id="rightSide">
        {!hideLayout && <TopNav width={width} setWidth={setWidth} />}

        <Outlet />
      </div>
    </div>
  );
}
