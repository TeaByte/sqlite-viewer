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

import { Textarea } from "@/components/ui/textarea";

import { invoke } from "@tauri-apps/api/tauri";
import React, { useState } from "react";

type x =
  | { result: { Ok: Array<{ [key: string]: string }> } }
  | { result: { Err: string } };

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
          <table className="table-auto">
            <thead>
              <tr>
                {Object.keys(result[0]).map((key) => (
                  <th key={key} className="border px-4 py-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <td key={index} className="border px-4 py-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </form>
    </div>
  );
}
