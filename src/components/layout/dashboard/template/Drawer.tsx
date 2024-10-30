/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Button, Drawer, Sidebar } from "flowbite-react";
import { useState } from "react";
import { SIDEBAR_ITEMS } from "./constant";
import { NavLink } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Logo from "../../../logo";

export function DrawerSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <div className="flex items-center justify-center lg:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="border border-primary bg-transparent text-primary hover:text-white focus:shadow-none"
        >
          <Bars3Icon className="size-6" />
        </Button>
      </div>
      <Drawer open={isOpen} onClose={handleClose} className="z-50">
        <Drawer.Header
          //@ts-ignore
          title={
            <div className="w-56">
              <Logo logoType="dark" className="mx-auto max-w-[100px]" />
            </div>
          }
          titleIcon={() => <></>}
        />
        <Drawer.Items>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <Sidebar.Items>
                  <Sidebar.ItemGroup>
                    {SIDEBAR_ITEMS.map((item) => (
                      <Sidebar.Item
                        // as={NavLink}
                        key={item.name}
                        // to={item.path}
                        icon={item.icon}
                      >
                        <NavLink
                          to={item.path}
                          className={({ isActive }: { isActive: boolean }) =>
                            isActive ? "capitalize text-primary" : "capitalize"
                          }
                        >
                          {item.name}
                        </NavLink>
                      </Sidebar.Item>
                    ))}
                  </Sidebar.ItemGroup>
                </Sidebar.Items>
              </div>
            </div>
          </Sidebar>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
