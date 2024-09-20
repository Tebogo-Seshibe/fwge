use std::{fs, ops::Add, os::windows::fs::{symlink_dir, symlink_file}, sync::Mutex};

use tauri::State;

use super::{models::{info::{General, Info}, project::Project}, utils::{create_template_files, npm, parse_project_file}};

#[tauri::command]
pub fn create_project(state: State<'_, Mutex<Project>>, project_name: &str, project_path: &str, create_folder: bool) -> Result<Project, String> {
    let base_path = if create_folder {
        &[project_path, project_name].join("/")
    } else {
        project_path
    };

    if create_folder {
        fs::create_dir(base_path).unwrap();
    }
    
    let project = Project {
        info: Info {
            general: General {
                name: project_name.to_string(),
                base_path: base_path.to_string(),
                ..Default::default()
            },
            ..Default::default()
        },
        ..Default::default()
    };

    create_template_files(base_path, project_name, &project).unwrap();

    let mut project_state = match state.lock() {
        Ok(result) => result,
        Err(err) => return Err(String::from("Failed to get current project state\n\r").add(&err.to_string()))
    };
    *project_state = project.clone();
    
    Ok(project)
}

#[tauri::command]
pub fn open_project(state: State<'_, Mutex<Project>>, file_path: &str) -> Result<Project, String> {
    let contents = match fs::read_to_string(file_path) {
        Ok(result) => result,
        Err(err) => return Err(String::from("Failed to parse command output\n\r").add(&err.to_string()))
    };    
    let project: Project = parse_project_file(&contents).unwrap();

    let mut project_state = match state.lock() {
        Ok(result) => result,
        Err(err) => return Err(String::from("Failed to get current project state\n\r").add(&err.to_string()))
    };
    *project_state = project.clone();

    Ok(project)
}

#[tauri::command]
pub fn get_project(state: State<'_, Mutex<Project>>) -> Result<Project, String> {
    Ok(state.lock().unwrap().clone())
}

#[tauri::command]
pub fn build_project(state: State<'_, Mutex<Project>>, handle: tauri::AppHandle) -> Result<(), String> {
    let project = match state.lock() {
        Ok(result) => result,
        Err(err) => return Err(String::from("Failed to get current project state\n\r").add(&err.to_string()))
    };

    let message = match npm(vec![&project.config.scripts.debug], &project.info.general.base_path) {
        Ok(result) => result,
        Err(err) => return Err(String::from("Failed to build project.\n\r").add(err.as_str()))
    };
    println!("{}", message);

    let src = project.info.general.base_path.clone()
        .add("\\dist\\")
        .add(&project.info.general.name)
        .add(".js");
    let dst = String::from(handle.path_resolver().resource_dir().unwrap().as_path().to_str().unwrap())
        .add("\\")
        .add(&project.info.general.name)
        .add(".js");

    symlink_file(src, dst).expect_err("Failed to import compiled project file.\n\r");

    let src = project.info.general.base_path.clone()
        .add("\\dist\\resources");
    let dst = String::from(handle.path_resolver().resource_dir().unwrap().as_path().to_str().unwrap())
        .add("\\resources");

    symlink_dir(src, dst).expect_err("Failed to import project resources.\n\r");

    Ok(())
}
