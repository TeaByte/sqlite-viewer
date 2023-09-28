#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use lazy_static::lazy_static;
use std::sync::Mutex;

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
            get_column
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
