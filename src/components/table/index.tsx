import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "../pagination";

export default function Table({
  data,
  page,
  total_pages,
  columns,
}: {
  data: unknown[];
  page: number;
  total_pages: number;
  // className?: CSSStyleSheet;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex w-full flex-col justify-between overflow-x-auto">
      <table className={`w-full table-auto text-start`}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="truncate border-y border-border-color py-6 pl-8  text-start text-gray-text last-of-type:pr-8"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="even:bg-border-color hover:bg-border-color/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="relative whitespace-nowrap border-b border-border-color px-4 pb-3 pl-8 pt-6 text-start font-semibold text-gray-text/80  last-of-type:pr-8"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>

      {!data.length && (
        <p className="w-full py-4 text-center text-red-600">
          No data available!
        </p>
      )}
      {total_pages > 1 ? (
        <Pagination pageNumber={page} slides={total_pages} />
      ) : null}
    </div>
  );
}
