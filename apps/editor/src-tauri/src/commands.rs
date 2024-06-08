use crate::utils::cli;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
pub fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!\n\r", name);
}

#[tauri::command]
pub fn create(project_name: &str, project_path: &str) -> String {
    let message = cli(vec!["new", project_name, project_path]);
    println!("{}", message);

    message
} 
