use std::{fs, sync::Mutex};

use tauri::State;

use crate::{fwge::{parse_fwgeproject, FWGEProject}, utils::cli};

#[tauri::command]
pub fn create(project_name: &str, project_path: &str) -> String {
    let message = cli(vec!["new", project_name, project_path]);

    message
} 


#[tauri::command]
pub async fn open(state: State<'_, Mutex<FWGEProject>>, file_path: &str) -> Result<FWGEProject, String> {
    let contents = match fs::read_to_string(file_path) {
        Ok(string) => string,
        Err(_) => return Err("Faild to read file".to_string()),
    }; 
    
    let fwge: FWGEProject = parse_fwgeproject(contents).unwrap();
    let mut mut_state = state.lock().unwrap();
    *mut_state = fwge.clone();

    // num.0 = 5;
    // s.0 = "Christoper".to_string();

    Ok(fwge)
}


#[tauri::command]
pub async fn get(state: State<'_, Mutex<FWGEProject>>) -> Result<FWGEProject, String> {
    let fwge = state.lock().unwrap().clone();
    println!("Author: {}", fwge.general.author);
    Ok(fwge)
}

