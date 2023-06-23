mod fwge;

pub mod launcher {
    #[tauri::command]
    pub fn greetName(name: &str) {
        format!("{}", name);
    }
}
