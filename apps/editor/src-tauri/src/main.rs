// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use std::process::Command;

use tauri::{api::dialog, CustomMenuItem, Menu, MenuItem, Submenu, WindowBuilder};
// use fwge::launcher::{greetName};

mod fwgeproject;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    return format!("Hello, {}! You've been greeted from Rust!\n\r", name);
}

#[tauri::command]
fn create(projectName: &str, projectPath: &str) {
    Command::new("fwge")
        .arg("new")
        .arg(projectName)
        .arg(projectPath)
        .output()
        .expect("Failed to run \"fwge new\"");
}

#[tauri::command]
fn redo() -> Result<(), String> {
    //TODO: Redo logic
    Ok(())
}

#[tauri::command]
fn open(projectPath: &str) -> Result<(), String> {
    //TODO: Redo logic
    Ok(())
}

#[tauri::command]
fn undo() -> Result<(), String> {
    
    Ok(())
}

fn main() {
    let file_sub_menu = Submenu::new(
        "File", 
        Menu::new()
            .add_item(
                CustomMenuItem::new("open".to_string(), "Open")
                .accelerator("CmdOrCtrl+O")
                .into()
            )
            .add_item(
                CustomMenuItem::new("open_recent".to_string(), "Open Recent")
                .accelerator("CmdOrCtrl+Shift+O")
                .into()
            )
            .add_native_item(MenuItem::Separator)
            .add_item(
                CustomMenuItem::new("save".to_string(), "Save")
                .accelerator("CmdOrCtrl+S")
                .into()
            )
            .add_item(
                CustomMenuItem::new("save_as".to_string(), "Save As")
                .accelerator("CmdOrCtrl+Shift+S")
                .into()
            )
            .add_native_item(MenuItem::Separator)
            .add_item(
                CustomMenuItem::new("build".to_string(), "Build")
                .accelerator("CmdOrCtrl+B")
                .into()
            )
            .add_item(
                CustomMenuItem::new("config".to_string(), "Build Setting")
                .accelerator("CmdOrCtrl+Shift+B")
                .into()
            )
            .add_native_item(MenuItem::Separator)
            .add_item(
                CustomMenuItem::new("settings".to_string(), "Settings")
                .accelerator("CmdOrCtrl+,")
                .into()
            )
            .add_item(
                CustomMenuItem::new("exit".to_string(), "Exit")
                .accelerator("CmdOrCtrl+Q")
                .into()
            )
    );

    let edit_sub_menu = Submenu::new(
        "Edit", 
        Menu::new()
            .add_item(
                CustomMenuItem::new("undo".to_string(), "Undo")
                .accelerator("CmdOrCtrl+Z")
                .into()
            )
            .add_item(
                CustomMenuItem::new("redo".to_string(), "Redo")
                .accelerator("CmdOrCtrl+Y")
                .into()
            )
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Cut)
            .add_native_item(MenuItem::Copy)
            .add_native_item(MenuItem::Paste)
    );
    let menu = Menu::new()
        .add_submenu(file_sub_menu)
        .add_submenu(edit_sub_menu);

    tauri::Builder::default()
        .setup(|app| {
            let window = WindowBuilder::new(
                app,
                "editor",
                tauri::WindowUrl::App("editor".into()),
            )
            .menu(menu)
            .title("FWGE: Editor")
            .inner_size(1280.0, 720.0)
            .resizable(true)
            .visible(false)
            .build()
            .expect("to build");

            // let win = window.clone();
            // window.on_menu_event(move |event| {
            //     match event.menu_item_id() {
            //         "exit" => {
            //             win.close().unwrap();
            //         },
            //         _ => {}
            //     }
            // });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![greet, undo, redo])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
