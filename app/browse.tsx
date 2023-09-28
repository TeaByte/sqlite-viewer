"use client";

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

export default function Browse(props: BrowseProps) {
  const { setSelectedTable, tables, selectedTable, records } = props;
  return (
    <div className="w-full">
      <div className="px-2">
        <Select
          //   value={tables[0]}
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
      </div>
      <div className="mt-3 h-[420px] overflow-auto">
        {selectedTable && records[selectedTable] && (
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(records[selectedTable]).map((column, index) => (
                  <TableHead key={index}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records[selectedTable][
                Object.keys(records[selectedTable])[0]
              ].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(records[selectedTable]).map(
                    (column, columnIndex) => (
                      <TableCell key={columnIndex}>
                        {records[selectedTable][column][rowIndex]}
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
