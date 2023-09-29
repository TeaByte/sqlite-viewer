"use client";

import { TableInfos } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Structure({ tablesInfo }: { tablesInfo: TableInfos }) {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {Object.keys(tablesInfo).map((table, index) => (
          <div key={index} className="flex flex-col">
            <AccordionItem value={table}>
              <AccordionTrigger className="font-bold p-2 bg-secondary opacity-70 flex gap-1 items-center">
                {table}
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>NotNull</TableHead>
                      <TableHead>Default Value</TableHead>
                      <TableHead>Primary Key</TableHead>
                      <TableHead>Schema</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tablesInfo[table].map((tableInfo, index) => (
                      <TableRow key={index}>
                        <TableCell>{tableInfo.name}</TableCell>
                        <TableCell>
                          {tableInfo.type
                            ? tableInfo.type
                            : `"${tableInfo.name}"`}
                        </TableCell>
                        <TableCell>
                          {tableInfo.notnull ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          {tableInfo.dflt_value ? tableInfo.dflt_value : "None"}
                        </TableCell>
                        <TableCell>{tableInfo.pk ? "Yes" : "No"}</TableCell>
                        <TableCell>{`"${tableInfo.name}" ${tableInfo.type} ${
                          tableInfo.notnull ? "NOT NULL" : ""
                        }`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </div>
        ))}
      </Accordion>
    </div>
  );
}
