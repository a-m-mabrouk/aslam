import { useTranslation } from "react-i18next";
import TitleSection from "../../../components/title";
import useFetch from "../../../hooks/useFetch";
import { API_STUDENTS } from "../../../router/routes/apiRoutes";
import BgCard from "../../../components/cards/bg";
import Table from "../../../components/table";
import { createColumnHelper } from "@tanstack/react-table";
import Loading from "../../../components/loading";
import { useEffect, useMemo, useState } from "react";
import CellRedirect from "../../../components/table/cellRedirect";
import { DASHBOARD_ROUTES } from "../../../router/routes/appRoutes";
import { Search } from "../../../components/search";
import { useQuery } from "../../../hooks/useQuery";
import axiosDefault from "../../../utilities/axios";
import { toastifyBox } from "../../../helper/toastifyBox";

const columnHelper = createColumnHelper<DataStudent>();

export default function Students() {
  const { t } = useTranslation("students");
  const { search, page } = useQuery();
  const [searchLoading, setSearchLoading] = useState(false);
  const { data, loading, setData } = useFetch<StudentsData>(
    `${API_STUDENTS.students}/search?page=${page}`,
  );

  const redirect = (id: number) => {
    return `${DASHBOARD_ROUTES.students}/${id}`;
  };

  useEffect(() => {
    let clear: NodeJS.Timeout;
    setSearchLoading(true);
    const getStudent = async () => {
      try {
        const { data } = await axiosDefault.get(
          `${API_STUDENTS.students}/search?${search ? `name=${search}&` : ""}page=${page}`,
        );

        setSearchLoading(false);
        setData((prev) =>
          prev
            ? {
                ...prev,
                data: data.data,
              }
            : prev,
        );
      } catch (err) {
        const { message } = err as Error;
        setSearchLoading(false);
        toastifyBox("error", message);
      }
    };
    if (search) {
      clear = setTimeout(() => getStudent(), 1000);
    }

    return () => {
      clearTimeout(clear);
    };
  }, [page, search, setData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: t("table.id"),
        cell: (info) => (
          <CellRedirect url={redirect(info.getValue())}>
            {info.getValue()}
          </CellRedirect>
        ),
      }),
      columnHelper.accessor("first_name", {
        header: t("table.firstName"),
        cell: (info) => {
          const id = info.row.original.id;
          const row = info.row.original;
          return (
            <CellRedirect url={redirect(id)}>
              {row.first_name + " " + row.last_name}
            </CellRedirect>
          );
        },
      }),
      columnHelper.accessor("phone_number", {
        header: t("table.phone_number"),
        cell: (info) => {
          const id = info.row.original.id;
          return (
            <CellRedirect url={redirect(id)}>{info.getValue()}</CellRedirect>
          );
        },
      }),
      columnHelper.accessor("email", {
        header: t("table.email"),
        cell: (info) => {
          const id = info.row.original.id;
          return (
            <CellRedirect url={redirect(id)}>{info.getValue()}</CellRedirect>
          );
        },
      }),
    ],
    [t],
  );

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap justify-between gap-4">
        <TitleSection title={t("title")} />
        <Search placeholder={t("searchEmail")} />
      </div>

      <BgCard>
        <div className="relative min-h-[400px]">
          {loading || searchLoading ? (
            <Loading position="absolute" />
          ) : (
            <Table
              data={data?.data || []}
              columns={columns}
              page={page}
              total_pages={+(data?.last_page || 1) || 1}
            />
          )}
        </div>
      </BgCard>
    </div>
  );
}
