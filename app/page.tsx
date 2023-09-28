"use client";

import { useState } from "react";
import Load from "./load";

import { open } from "@tauri-apps/api/dialog";

export default function Home() {
  const [selectedDataBase, setSelectedDataBase] = useState<string | null>(null);

  const onClick = async () => {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: "SQLite Database",
          extensions: ["db", "sqlite3", "sqlite", "db3"],
        },
      ],
    });

    if (selected === null) {
      console.log("No file selected");
    } else {
      if (typeof selected === "string") {
        await setSelectedDataBase(selected);
      }
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      {selectedDataBase ? (
        <Load path={selectedDataBase} />
      ) : (
        <button className="p-4 bg-primary text-background" onClick={onClick}>
          Select Database
        </button>
      )}
    </main>
  );
}
