use tauri::{MenuEvent, Window};

use super::models::{BuildPayload, ConfigPayload, OpenPayload, OpenRecentPayload, SaveAsPayload, SavePayload, SettingsPayload};
use super::ids::{BUILD, CONFIG, OPEN, OPEN_RECENT, SAVE, SAVE_AS, SETTINGS};

pub fn open(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(OPEN, OpenPayload {}).unwrap();

    Ok(())
}

pub fn open_recent(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(OPEN_RECENT, OpenRecentPayload {}).unwrap();

    Ok(())
}

pub fn save(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(SAVE, SavePayload {}).unwrap();
    
    Ok(())
}

pub fn save_as(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(SAVE_AS, SaveAsPayload {}).unwrap();
    
    Ok(())
}

pub fn build(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(BUILD, BuildPayload {}).unwrap();
    
    Ok(())
}

pub fn config(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(CONFIG, ConfigPayload {}).unwrap();
    
    Ok(())
}

pub fn settings(window: &Window, _event: &MenuEvent) -> Result<(), String> {
    window.emit(SETTINGS, SettingsPayload {}).unwrap();
    
    Ok(())
}
