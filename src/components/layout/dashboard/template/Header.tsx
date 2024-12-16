import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store";
import LangBtn from "../../../button/langBtn";
import { logout } from "../../../../store/reducers/auth";
import { DrawerSidebar } from "./Drawer";

const theme = {
  root: {
    inner: {
      base: "mx-auto flex flex-wrap items-center justify-between h-full",
    },
  },
};
export default function Header() {
  const { t } = useTranslation("common");
  const { first_name, last_name, email, id } = useAppSelector(
    (state) => state.auth,
  );
  
  const dispatch = useAppDispatch();
  return (
    <Navbar fluid className="sticky z-10 min-h-[85px]" theme={theme}>
      <DrawerSidebar />
      <div className="flex grow gap-2  md:order-2">
        <LangBtn />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              rounded
              placeholderInitials={`${first_name[0]}${last_name[0]}`.toUpperCase()}
            />
          }
        >
          <Dropdown.Header>
            <span className="block text-lg capitalize text-primary">
              {first_name} {last_name}
            </span>
            <div className="grid gap-2">
              <span className="block truncate text-xs font-medium">
                {email}
              </span>
              <span className="block truncate text-sm font-medium">
                {t("id")}: {id}
              </span>
            </div>
          </Dropdown.Header>
          <Dropdown.Item
            className="text-red-500 hover:bg-red-500/20"
            onClick={() => dispatch(logout())}
          >
            {t("logout")}
          </Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
}
