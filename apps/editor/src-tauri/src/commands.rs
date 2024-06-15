use std::{borrow::Borrow, fs, str::FromStr};

use crate::{fwge::{parseFWGEProject, Build, FWGEProject, General, Libraries, Library, Scripts, Target}, utils::cli};
use yaml_rust2::YamlLoader;

#[tauri::command]
pub fn create(project_name: &str, project_path: &str) -> String {
    let message = cli(vec!["new", project_name, project_path]);
    println!("{}", message);

    message
} 


#[tauri::command]
pub fn open(file_path: &str) -> Result<FWGEProject, String> {
    let string = fs::read_to_string(file_path).unwrap();

    match parseFWGEProject(string) {
        Ok(fwge) => fwge,
        Err() => "Failed to parse file".to_string()
    }
} 
