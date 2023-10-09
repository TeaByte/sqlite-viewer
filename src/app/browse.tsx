"use client";

import { useState } from "react";
import { Columns } from "@/types";
import { SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BrowseProps {
  setSelectedTable: (value: SetStateAction<string>) => void;
  tables: string[];
  selectedTable: string;
  records: Columns;
}

const ROWS_PER_PAGE = 100;

export default function Browse(props: BrowseProps) {
  const { setSelectedTable, tables, selectedTable, records } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;

  const totalPages = Math.ceil(
    records[selectedTable]?.[Object.keys(records[selectedTable])[0]]?.length /
      ROWS_PER_PAGE
  );

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full">
      <div className="px-2 flex gap-2 items-center">
        {selectedTable && (
          <Select
            value={selectedTable}
            onValueChange={(table: string) => {
              setCurrentPage(1);
              setSelectedTable(table);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Table" />
            </SelectTrigger>
            <SelectContent className="h-[150px] overflow-y-auto">
              <SelectGroup>
                <SelectLabel>Select Table</SelectLabel>
                {tables.map((table, index) => (
                  <SelectItem value={table} key={index}>
                    {table}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        <span className="text-sm">
          {(selectedTable &&
            records[selectedTable][Object.keys(records[selectedTable])[0]]
              ?.length) ||
            0}{" "}
          Rows
        </span>
        <span className="text-sm">
          ( Page {currentPage} of {totalPages} )
        </span>
      </div>
      <section className="flex flex-col">
        <div className="mt-2 overflow-auto mb-[55px]">
          {selectedTable && records[selectedTable] && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(records[selectedTable]).map(
                      (column, index) => (
                        <TableHead key={index}>{column}</TableHead>
                      )
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records[selectedTable][
                    Object.keys(records[selectedTable])[0]
                  ]
                    .slice(startIndex, endIndex)
                    .map((_, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.keys(records[selectedTable]).map(
                          (column, columnIndex) => (
                            <TableCell
                              key={columnIndex}
                              className="max-w-[150px] truncate"
                            >
                              <span>
                                {
                                  records[selectedTable][column][
                                    rowIndex + startIndex
                                  ]
                                }
                              </span>
                            </TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        )}
      </section>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );
  return (
    <ul className="flex overflow-x-scroll fixed bottom-0 w-full">
      {pageNumbers.map((page) => (
        <li
          key={page}
          className={`grow ${
            currentPage === page ? "bg-primary text-background" : "bg-secondary"
          }`}
        >
          <button
            className={`page-link p-2 text-center w-full`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        </li>
      ))}
    </ul>
  );
};
