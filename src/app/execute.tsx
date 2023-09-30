"use client";

import { invoke } from "@tauri-apps/api/tauri";
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export default function ExecuteSQL({ table }: { table: string }) {
  const [sql, setSQL] = useState("");
  const [result, setResult] = useState<string | string[]>();

  async function executeSQLCall(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sql.length === 0) {
      setResult("No SQL to execute");
      return;
    }
    const executeResult = await invoke<any>("execute", {
      sql: sql,
    });

    console.log(executeResult);

    if (executeResult.result.Err) {
      setResult(executeResult.result.Err);
      return;
    }

    if (executeResult.result.Ok.length === 0) {
      setResult("SQL Executed successfully with no results");
      return;
    }

    setResult(executeResult.result.Ok);
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={executeSQLCall} className="px-4 flex flex-col gap-2">
        <Textarea
          placeholder={`SELECT * FROM ${table}`}
          value={sql}
          onChange={(e) => setSQL(e.target.value)}
        />
        <button className="bg-secondary text-primary p-2 px-10 rounded-md hover:bg-primary hover:text-secondary transition-all">
          Execute SQL
        </button>
        {typeof result === "string" ? (
          <p>{result}</p>
        ) : result instanceof Array ? (
          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(result[0]).map((key) => (
                  <TableHead key={key}>{key}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, index) => (
                    <TableCell key={index} className="max-w-[150px] truncate">
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : null}
      </form>
    </div>
  );
}
