use std::fs;

use crate::{fwge::{parse_fwgeproject, FWGEProject}, utils::cli};

#[tauri::command]
pub fn create(project_name: &str, project_path: &str) -> String {
    let message = cli(vec!["new", project_name, project_path]);
    println!("{}", message);

    message
} 


#[tauri::command]
pub fn open(file_path: &str) -> Result<FWGEProject, String> {
    let contents = match fs::read_to_string(file_path) {
        Ok(string) => string,
        Err(_) => return Err("Faild to read file".to_string()),
    }; 

    parse_fwgeproject(contents)
} 
