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
  setSelectedTable: (value: SetStateAction<string | null>) => void;
  tables: string[];
  selectedTable: string | null;
  records: Columns;
}

const ROWS_PER_PAGE = 100;

export default function Browse(props: BrowseProps) {
  const { setSelectedTable, tables, selectedTable, records } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;

  const totalPages = Math.ceil(
    // @ts-ignore
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
            onValueChange={(table: string) => setSelectedTable(table)}
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
      </div>
      <div className="mt-2 h-[420px] overflow-auto">
        {selectedTable && records[selectedTable] && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.keys(records[selectedTable]).map((column, index) => (
                    <TableHead key={index}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {records[selectedTable][Object.keys(records[selectedTable])[0]]
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
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
  // @ts-ignore
  const pageNumbers = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <ul className="flex overflow-x-scroll">
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
