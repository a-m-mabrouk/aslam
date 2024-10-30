import { Outlet } from "react-router";
import { NavbarLayout } from "../../navbar";

export default function StudentLayout() {
  return (
    <div className="grid grid-cols-1">
      <NavbarLayout />
      <Outlet />
    </div>
  );
}
