import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Link, NavLink } from "react-router-dom";
import { STUDENT_ROUTES } from "../../router/routes/appRoutes";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/reducers/auth";
import LangBtn from "../button/langBtn";
import { useTranslation } from "react-i18next";
import Logo from "../logo";

const linkActive = ({ isActive }: { isActive: boolean }) =>
  `text-lg m-[0_!important] ${isActive ? "text-primary" : ""}`;

const theme = {
  root: {
    base: "bg-white px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4",
    rounded: {
      on: "rounded",
      off: "",
    },
    bordered: {
      on: "border",
      off: "",
    },
    inner: {
      base: "mx-auto flex flex-wrap items-center justify-between",
      fluid: {
        on: "",
        off: "container",
      },
    },
  },
  brand: {
    base: "flex items-center",
  },
  collapse: {
    base: "w-full md:block md:w-auto",
    list: "mt-4 flex flex-col md:mt-0 md:flex-row md:space-x-8 md:text-sm md:font-medium gap-4",
    hidden: {
      on: "hidden",
      off: "",
    },
  },
  link: {
    base: "block py-2 pl-3 pr-4 md:p-0",
    active: {
      on: "bg-cyan-700 text-white dark:text-white md:bg-transparent md:text-cyan-700",
      off: "border-b border-gray-100 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:hover:bg-transparent md:hover:text-cyan-700 md:dark:hover:bg-transparent md:dark:hover:text-white",
    },
    disabled: {
      on: "text-gray-400 hover:cursor-not-allowed dark:text-gray-600",
      off: "",
    },
  },
  toggle: {
    base: "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden",
    icon: "h-6 w-6 shrink-0",
  },
};

export function NavbarLayout() {
  const { t } = useTranslation("common");
  const { first_name, last_name, email, id } = useAppSelector(
    (state) => state.auth,
  );
  const dispatch = useAppDispatch();

  return (
    <Navbar rounded theme={theme}>
      <Navbar.Brand to="/" as={Link}>
        <Logo logoType="dark" className="mx-auto max-w-[70px]" />
      </Navbar.Brand>
      <div className="flex gap-2 md:order-2">
        <LangBtn />
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              // img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
              placeholderInitials={first_name[0] + last_name[0]}
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
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <NavLink to={STUDENT_ROUTES.student} className={linkActive}>
          {t("home")}
        </NavLink>
        <NavLink to={STUDENT_ROUTES.courses} className={linkActive}>
          {t("courses")}
        </NavLink>
      </Navbar.Collapse>
    </Navbar>
  );
}
