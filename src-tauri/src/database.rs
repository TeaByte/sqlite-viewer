use std::collections::HashMap;
use rusqlite::types::Value;
use rusqlite::Connection;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct TableInfo {
    pub cid: i32,
    pub name: String,
    pub r#type: String,
    pub notnull: bool,
    pub dflt_value: Option<String>,
    pub pk: bool,
}

pub struct DataBase {
    pub connection: Connection,
}

impl DataBase {
    pub fn new(path: &str) -> DataBase {
        DataBase {
            connection: Connection::open(path).expect("Failed to open database"),
        }
    }

    // pub fn connection(&self) -> &Connection {
    //     &self.connection
    // }

    pub fn get_tables(&self) -> Vec<String> {
        let mut stmt = self
            .connection
            .prepare("SELECT name FROM sqlite_master WHERE type='table'")
            .expect("Failed to prepare query");

        let tables_names: Vec<String> = stmt
            .query_map([], |row| Ok(row.get(0)?))
            .expect("Failed to get tables from database")
            .map(|result| result.unwrap())
            .collect();

        tables_names
    }

    pub fn get_table_info(&self, table_name: &String) -> Vec<TableInfo> {
        let mut stmt = self
            .connection
            .prepare(&format!("PRAGMA table_info({})", table_name))
            .expect("Failed to prepare query");

        let table_info: Vec<TableInfo> = stmt
            .query_map([], |row| {
                Ok(TableInfo {
                    cid: row.get(0)?,
                    name: row.get(1)?,
                    r#type: row.get(2)?,
                    notnull: row.get(3)?,
                    dflt_value: row.get(4)?,
                    pk: row.get(5)?,
                })
            })
            .expect("Failed to get table info from database")
            .map(|result| result.unwrap())
            .collect();

        table_info
    }

    pub fn get_column(&self, table_name: &str, column_name: &str) -> Vec<Value> {
        let mut stmt = self
            .connection
            .prepare(&format!("SELECT {} FROM {}", column_name, table_name))
            .expect("Failed to prepare fetch query");

        let results: Vec<Value> = stmt
            .query_map([], |row| {
                let value = row.get(0)?;
                Ok(value)
            })
            .expect("Failed to execute query")
            .map(|result| result.unwrap())
            .collect();

        results
    }

    pub fn execute(&self, sql: &str) -> Result<Vec<HashMap<String, String>>, rusqlite::Error> {
        let mut result = Vec::new();
        let mut stmt = self.connection.prepare(sql)?;
        let column_names: Vec<String> = stmt.column_names().into_iter().map(|s| s.to_string()).collect();
        let rows = stmt.query_map([], |row| {
            let mut columns = HashMap::new();
            for (index, name) in column_names.iter().enumerate() {
                let value: Option<Value> = row.get(index).ok();
                if let Some(value) = value {
                    columns.insert(name.clone(), convert(value));
                }
            }
            Ok(columns)
        })?;
    
        for row in rows {
            result.push(row?);
        }
        Ok(result)
    }
}


pub fn convert(value: Value) -> String {
    match value {
        Value::Null => String::from("Null"),
        Value::Integer(v) => v.to_string(),
        Value::Real(v) => v.to_string(),
        Value::Text(v) => v.to_string(),
        Value::Blob(_) => String::from("<Blob Object>"),
    }
}
