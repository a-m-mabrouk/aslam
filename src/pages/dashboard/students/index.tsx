import { useTranslation } from "react-i18next";
import TitleSection from "../../../components/title";
import BgCard from "../../../components/cards/bg";
import Table from "../../../components/table";
import { createColumnHelper } from "@tanstack/react-table";
import Loading from "../../../components/loading";
import { useEffect, useMemo } from "react";
import CellRedirect from "../../../components/table/cellRedirect";
import { DASHBOARD_ROUTES } from "../../../router/routes/appRoutes";
import { Search } from "../../../components/search";
import { useQuery } from "../../../hooks/useQuery";
import { fetchStudents } from "../../../store/reducers/students";
import { useAppDispatch, useAppSelector } from "../../../store";
import { toastifyBox } from "../../../helper/toastifyBox";

const columnHelper = createColumnHelper<DataStudent>();

export default function Students() {
  // const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const {
    data,
    loading: searchLoading,
    error,
  } = useAppSelector(({ students }) => students);
  const { t } = useTranslation("students");
  const { search, page } = useQuery();

  const redirect = (id: number) => {
    return `${DASHBOARD_ROUTES.students}/${id}`;
  };

  useEffect(() => {
    if (error) {
      toastifyBox("error", error);
      return;
    }
    const time = search? 1000 : 0;
    
    const clear: NodeJS.Timeout = setTimeout(
      () => dispatch(fetchStudents({ search, page })),
      time,
    );

    return () => {
      clearTimeout(clear);
    };
  }, [dispatch, page, search, error]);

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
          {data?.students === null || searchLoading? (
            <>
              <Loading position="absolute" />
            </>
          ) : (
            <Table
              data={data?.students || []}
              columns={columns}
              page={data?.currentPage}
              total_pages={+(data?.lastPage || 1) || 1}
            />
          )}
        </div>
      </BgCard>
    </div>
  );
}
