// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod menu;
mod utils;

use menu::{build, config, open, open_recent, save, save_as, settings};
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowBuilder};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

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
            .add_native_item(MenuItem::Quit)
    );

    let edit_sub_menu = Submenu::new(
        "Edit", 
        Menu::new()
            .add_native_item(MenuItem::Undo)
            .add_native_item(MenuItem::Redo)
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

            let win = window.clone();
            window.on_menu_event(move |event| {
                let _ = match event.menu_item_id() {
                    "open" => open(&win),
                    "open_recent" => open_recent(&win),
                    "save" => save(&win),
                    "save_as" => save_as(&win),
                    "build" => build(&win),
                    "config" => config(&win),
                    "settings" => settings(&win),
                    &_ => todo!()
                };
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![commands::greet, commands::create])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
