#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use lazy_static::lazy_static;
use std::{sync::Mutex, collections::HashMap};

use serde::Serialize;
mod database;
use database::{convert, DataBase, TableInfo};

lazy_static! {
    static ref DB_INSTANCE: Mutex<Option<DataBase>> = Mutex::new(None);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            change_database_path,
            get_tables,
            get_table_info,
            get_column,
            execute
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn change_database_path(new_path: String) {
    *DB_INSTANCE.lock().unwrap() = Some(DataBase::new(&new_path));
}

#[tauri::command]
fn get_tables() -> Vec<String> {
    if let Some(db) = DB_INSTANCE.lock().unwrap().as_ref() {
        db.get_tables()
    } else {
        Vec::new()
    }
}

#[tauri::command]
fn get_table_info(table_name: String) -> Vec<TableInfo> {
    if let Some(db) = DB_INSTANCE.lock().unwrap().as_ref() {
        db.get_table_info(&table_name)
    } else {
        Vec::new()
    }
}

#[tauri::command]
fn get_column(table_name: String, column_name: String) -> Vec<String> {
    let mut records = Vec::new();
    if let Some(db) = DB_INSTANCE.lock().unwrap().as_ref() {
        for record in db.get_column(&table_name, &column_name) {
            records.push(convert(record));
        }
    };
    records
}

#[derive(Debug, Serialize)]
pub struct Execute {
    result: Result<Vec<HashMap<String, String>>, String>
}

#[tauri::command]
fn execute(sql: String) -> Execute  {
    if let Some(db) = DB_INSTANCE.lock().unwrap().as_ref() {
        return match db.execute(&sql) {
            Ok(d) => Execute{ result: Ok(d) },
            Err(e) => Execute{ result: Err(e.to_string()) }
        };
    };
    Execute{ result: Err("Error".to_string()) }
}