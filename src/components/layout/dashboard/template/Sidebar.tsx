import { Sidebar } from "flowbite-react";
import { SIDEBAR_ITEMS } from "./constant";
import { DASHBOARD_ROUTES } from "../../../../router/routes/appRoutes";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logo from "../../../logo";
const theme = {
  root: {
    inner:
      "h-full overflow-y-auto overflow-x-hidden rounded bg-white px-3 py-4 dark:bg-gray-800",
  },
};
export default function DBSidebar() {
  const { t } = useTranslation("common");
  return (
    <Sidebar
      aria-label="sidebar"
      className="sticky top-0 w-0 overflow-hidden bg-white lg:w-64"
      theme={theme}
    >
      <Sidebar.Items>
        <Sidebar.Logo href={DASHBOARD_ROUTES.courses} img="">
          <div className="w-56">
            <Logo logoType="dark" className="mx-auto max-w-[100px]" />
          </div>
        </Sidebar.Logo>
        <Sidebar.ItemGroup>
          {SIDEBAR_ITEMS.map((item) => (
            <Sidebar.Item key={item.name} icon={item.icon} as="div">
              <NavLink
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  isActive ? "capitalize text-primary" : "capitalize"
                }
              >
                {t(item.name)}
              </NavLink>
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
