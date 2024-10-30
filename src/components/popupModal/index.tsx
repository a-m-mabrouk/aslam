import { ReactNode, Fragment, FormHTMLAttributes } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function PopupModal({
  title,
  isOpen,
  closeModal,
  children,
  width = "max-w-[775px]",
  height = "",
  icon = true,
}: {
  isOpen: boolean;
  title: string;
  width?: string;
  height?: string;
  closeModal: () => void;
  children: ReactNode;
  icon?: boolean;
}) {
  const { i18n } = useTranslation();
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[1000]" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            // eslint-disable-next-line tailwindcss/migration-from-tailwind-2
            className="fixed inset-0 bg-black bg-opacity-25"
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center  p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${width} ${height} overflow-hidden rounded-2xl bg-white text-left align-middle transition-all `}
                style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
              >
                <Dialog.Title
                  as="h3"
                  className="relative z-10 flex items-center justify-between border-b border-border-color px-3  py-4 text-2xl font-normal capitalize leading-6"
                >
                  <span className=" text-[24px]">{title}</span>

                  {icon && (
                    <button
                      type="button"
                      title="closeModal"
                      name="closeModal"
                      onClick={closeModal}
                      className=" outline-none"
                    >
                      <XMarkIcon className=" size-8 rounded-full text-gray-text/50 " />
                    </button>
                  )}
                </Dialog.Title>
                <div className="flex w-full flex-wrap gap-6 rounded-b-2xl bg-white p-8">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

const form = (props: FormHTMLAttributes<HTMLFormElement>) => (
  <form {...props} className="grid w-full grid-cols-1 gap-4" />
);

PopupModal.Form = form;
