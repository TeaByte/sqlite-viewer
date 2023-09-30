"use client";

import { Columns, TableInfos, TableInfo } from "@/types";
import { useState, useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Browse from "./browse";
import Structure from "./structure";
import ExecuteSQL from "./execute";

export default function Load({ path }: { path: string }) {
  const [records, setRecords] = useState<Columns>({});
  const [tables, setTables] = useState<string[]>([]);
  const [tablesInfo, setTablesInfo] = useState<TableInfos>({});
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  useEffect(() => {
    onSelectedDatabase();
  }, []);

  const onSelectedDatabase = async () => {
    await invoke("change_database_path", {
      newPath: path,
    });

    const tableNames = await invoke<string[]>("get_tables");
    if (tableNames.length === 0) {
      console.log("No tables or wrong database path");
      return;
    }

    const dbTablesInfo: TableInfos = {};
    const dbColumns: Columns = {};

    for (const table of tableNames) {
      const tableInfo = await invoke<TableInfo[]>("get_table_info", {
        tableName: table,
      });

      dbTablesInfo[table] = tableInfo;

      dbColumns[table] = {};
      for (const tableInfoEntry of tableInfo) {
        const columns = await invoke<string[]>("get_column", {
          tableName: table,
          columnName: tableInfoEntry.name,
        });
        dbColumns[table][tableInfoEntry.name] = columns;
      }
    }

    setTablesInfo(dbTablesInfo);
    setTables(tableNames);
    setRecords(dbColumns);
    setSelectedTable(tableNames[0]);
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="structure">
        <TabsList className="w-full flex gap-2">
          <TabsTrigger value="structure" className="grow">
            Structure
          </TabsTrigger>
          <TabsTrigger value="browse" className="grow">
            Browse Data
          </TabsTrigger>
          <TabsTrigger value="execute" className="grow">
            Execute SQL
          </TabsTrigger>
        </TabsList>
        <TabsContent value="structure">
          <Structure tablesInfo={tablesInfo} />
        </TabsContent>
        <TabsContent value="browse">
          <Browse
            tables={tables}
            selectedTable={selectedTable}
            records={records}
            setSelectedTable={setSelectedTable}
          />
        </TabsContent>
        <TabsContent value="execute">
          <ExecuteSQL table={tables[0]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
