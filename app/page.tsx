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
    <main className="flex flex-col">
      {selectedDataBase ? (
        <Load path={selectedDataBase} />
      ) : (
        <div className="flex flex-col mt-20 gap-2 text-center">
          <h1 className="text-center text-5xl">SQLite Viewer</h1>
          <button
            className="p-4 bg-primary text-background w-full hover:opacity-80"
            onClick={onClick}
          >
            Select Database
          </button>
          <p>SQLite Viewer GUI Program written in Rust using Tauri + NextJS</p>
          <p>I dont know what to put in this place!</p>
        </div>
      )}
    </main>
  );
}
