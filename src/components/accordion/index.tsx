import {
  Accordion,
  AccordionContentProps,
  AccordionPanelProps,
  AccordionProps,
  AccordionTitleProps,
} from "flowbite-react";

const theme = {
  arrow: {
    base: "h-6 w-6 shrink-0",
    open: {
      off: "",
      on: "rotate-180",
    },
  },
  base: "flex w-full items-center justify-between p-5 text-left font-medium text-gray-500 first:rounded-t-lg last:rounded-b-lg dark:text-gray-400 remove-shadow",
  flush: {
    off: "hover:bg-gray-100  dark:hover:bg-gray-800 ",
    on: "bg-transparent dark:bg-transparent",
  },
  heading: "",
  open: {
    off: "",
    on: "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white",
  },
};

export function AccordionCard({ children }: AccordionProps) {
  return <Accordion collapseAll>{children}</Accordion>;
}

const panel = (props: AccordionPanelProps) => <Accordion.Panel {...props} />;
const title = (props: AccordionTitleProps) => (
  <Accordion.Title {...props} theme={theme} />
);
const content = (props: AccordionContentProps) => (
  <Accordion.Content {...props} />
);

AccordionCard.Title = title;

AccordionCard.Content = content;
AccordionCard.Panel = panel;
