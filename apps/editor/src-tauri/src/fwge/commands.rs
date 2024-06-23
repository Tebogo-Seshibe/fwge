use std::{fs, process::Stdio, sync::Mutex};

use serde::Deserialize;
use tauri::{api::file::read_string, State};

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
        project_uuid: fwge.general.uuid,
        project_name: fwge.general.name,
        file_path: file_path.to_string(),
        project_thumbnail: "".to_string()
    })
}

#[tauri::command]
pub fn get(state: State<'_, Mutex<FWGEProject>>) -> Result<FWGEProject, String> {
    Ok(state.lock().unwrap().clone())
}

#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct ClassDefinition {
    pub name: String,
    pub code: String
}


#[tauri::command]
pub fn get_definitions() -> Result<String, String> {
    node(vec!["cli/load-project.cjs"]).unwrap();
    
    let js = fs::read_to_string("__out.js").unwrap();
    // let definitions: Vec<ClassDefinition> = serde_json::from_str(json.as_str()).unwrap();
    
    // Ok(definitions)
    Ok(js)
}


pub fn node(command: Vec<&str>) -> Result<String, String> {
    let result = std::process::Command::new("node")
        .args(command)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .expect("Failed to execute command");

    let output = match result.status.success() {
        true => result.stdout,
        false => result.stderr,
    };

    match String::from_utf8(output) {
        Ok(s) => Ok(s),
        Err(_) => Err("Failed to parse command output".to_string())
    }
}
