use std::{fs, sync::Mutex};

use tauri::State;

use super::models::{parse_fwgeproject, FWGEProject, FWGEProjectInfo};

#[tauri::command]
pub fn create(_project_name: &str, _project_path: &str) -> String {
    // Create the folders and files
    "message".to_string()
} 

#[tauri::command]
pub fn open(state: State<'_, Mutex<FWGEProject>>, file_path: &str) -> Result<FWGEProjectInfo, String> {
    let contents = fs::read_to_string(file_path).unwrap();    
    let fwge: FWGEProject = parse_fwgeproject(contents).unwrap();

    *state.lock().unwrap() = fwge.clone();

    Ok(FWGEProjectInfo {
        project_name: fwge.general.name,
        file_path: fwge.general.location,
        project_thumbnail: "".to_string()
    })
}

#[tauri::command]
pub fn get(state: State<'_, Mutex<FWGEProject>>) -> Result<FWGEProject, String> {
    Ok(state.lock().unwrap().clone())
}
