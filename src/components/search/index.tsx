import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useQuery } from "../../hooks/useQuery";

export function Search({
  full,
  ...props
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { full?: boolean }) {
  const { search } = useQuery();
  const inputSearch = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const onSearch = useCallback(() => {
    const input = inputSearch.current;
    if (!input) return;
    const url = window.location.href;
    const newUrl = new URL(url);

    newUrl.searchParams.set(
      "search",
      input?.value.trim() !== " " || input?.value ? input?.value.trim() : "",
    );
    newUrl.searchParams.set("page", "1");
    navigate(`${newUrl.pathname}${newUrl.search}`, {
      replace: true,
    });
  }, [navigate]);

  const inputKeyUpHandler = (
    e: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, unknown>,
  ) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div
      className={`flex min-h-[56px] w-full min-w-[200px] flex-wrap ${
        full ? "" : "max-w-[600px]"
      } justify-end`}
    >
      <div className="relative grow">
        <label
          htmlFor="search"
          className="flex w-full items-center gap-2 overflow-hidden  rounded-xl border border-gray-text/[8%]  bg-white px-4 py-2 pl-5 text-[#717171]"
        >
          <MagnifyingGlassIcon className="size-6 " />
          <input
            type="Search"
            name={"search"}
            id={"search"}
            placeholder={props.placeholder || "Search"}
            defaultValue={search || ""}
            onChange={onSearch}
            onKeyUp={inputKeyUpHandler}
            autoComplete="off"
            className="w-full min-w-0 border-0  bg-transparent text-[16px] font-medium shadow-none placeholder:overflow-hidden placeholder:text-ellipsis placeholder:text-[#717171] focus:border-none focus:shadow-none focus:outline-0 "
            ref={inputSearch}
          />
        </label>
      </div>
    </div>
  );
}
