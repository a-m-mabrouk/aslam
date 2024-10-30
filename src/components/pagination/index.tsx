import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../../hooks/useQuery";
import { useTranslation } from "react-i18next";

type pagesProps = {
  pageNumber: number;
  slides: number;
};

export default function Pagination({ slides }: pagesProps) {
  const { i18n } = useTranslation();
  const router = useNavigate();
  const { page } = useQuery();
  const pageNumber = +page || 1;
  const start = useCallback(() => {
    const startNumber = pageNumber - 2;
    if (pageNumber === 1) return 1;
    if (pageNumber === 3) return 2;
    else if (pageNumber === slides) return startNumber - 2;
    return startNumber;
  }, [slides, pageNumber]);

  const end = useCallback(() => {
    const endNumber = pageNumber + 2;
    if (pageNumber - 1 === 0) return pageNumber + 3;
    return endNumber;
  }, [pageNumber]);

  const goTO = (num: number) => {
    const url = window.location.href;
    const newUrl = new URL(url);

    newUrl.searchParams.set("page", `${num}`);
    router(`${newUrl.pathname}${newUrl.search}`);
  };

  return (
    slides > 1 && (
      <ul
        className={`mx-auto mt-4 flex items-end justify-center gap-2 self-end rounded-md px-3 py-2 text-gray-500 ${i18n.language === "ar" && "flex-row-reverse"}`}
      >
        <li
          onClick={() => goTO(pageNumber - 1)}
          className={`${
            pageNumber !== 1 && slides !== 0
              ? "cursor-pointer "
              : " pointer-events-none opacity-30"
          } grid size-[50px] place-content-center border border-[#DADCE3]`}
        >
          <ChevronLeftIcon className="size-6" />
        </li>

        {Array.from({ length: slides }).map((_, ind) =>
          ind + 1 >= start() && ind + 1 <= end() ? (
            pageNumber === ind + 1 ? (
              <li
                key={ind * Math.random()}
                className="pointer-events-none grid size-[50px] place-content-center rounded-md border-2 border-primary text-2xl leading-6  text-primary"
              >
                <button type="button" onClick={() => goTO(ind + 1)}>
                  {ind + 1}
                </button>
              </li>
            ) : (
              <li
                key={ind * Math.random()}
                className="grid size-[50px] place-content-center rounded-md border-2 text-2xl leading-6 text-[#8E8E8E]"
              >
                <button type="button" onClick={() => goTO(ind + 1)}>
                  {ind + 1}
                </button>
              </li>
            )
          ) : null,
        )}

        {end() < slides && (
          <>
            <li className="text-xl text-[#8E8E8E]">...</li>

            <li className="grid size-[50px] place-content-center rounded-md border-2 text-2xl leading-6 text-[#8E8E8E]">
              <button type="button" onClick={() => goTO(slides)}>
                {slides}
              </button>
            </li>
          </>
        )}

        <li
          className={`${
            pageNumber === slides
              ? "pointer-events-none opacity-30"
              : "cursor-pointer"
          } grid size-[50px] place-content-center border border-[#DADCE3]`}
          onClick={() => goTO(pageNumber + 1)}
        >
          <ChevronRightIcon className="size-6" />
        </li>
      </ul>
    )
  );
}
