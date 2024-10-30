import { Outlet } from "react-router";
import Header from "./template/Header";
import DBSidebar from "./template/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr]">
      <DBSidebar />
      <div className="grid grid-rows-[auto_1fr] ">
        <Header />
        <div className="relative p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
