// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod editor;
mod menu;
mod project;

use tauri::{CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowBuilder};

fn main() {
    let file_sub_menu = Submenu::new(
        "File", 
        Menu::new()
            .add_item(
                CustomMenuItem::new("open".to_string(), "Open...")
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
                CustomMenuItem::new("save_as".to_string(), "Save As...")
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
        .manage(std::sync::Mutex::new(project::models::project::Project::default()))
        .setup(|app| {
            let launcher_window = WindowBuilder::new(
                app,
                "launcher",
                tauri::WindowUrl::App("launcher".into())
            )
            .title("FWGE: Launcher")
            .inner_size(600.0, 400.0)
            .center()
            .fullscreen(false)
            .resizable(false)
            .visible(true)
            .build()
            .unwrap();

            let editor_window: tauri::Window = WindowBuilder::new(
                app,
                "editor",
                tauri::WindowUrl::App("editor".into()),
            )
            .menu(menu)
            .title("FWGE: Editor")
            .inner_size(1280.0, 720.0)
            .center()
            .resizable(true)
            .visible(false)
            .build()
            .unwrap();


            let window = editor_window.clone();
            editor_window.on_menu_event(move |event| {
                let _ = match event.menu_item_id() {
                    "open" => menu::events::open(&window, &event),
                    "open_recent" => menu::events::open_recent(&window, &event),
                    "save" => menu::events::save(&window, &event),
                    "save_as" => menu::events::save_as(&window, &event),
                    "build" => menu::events::build(&window, &event),
                    "config" => menu::events::config(&window, &event),
                    "settings" => menu::events::settings(&window, &event),
                    &_ => panic!()
                };
            });

            app.listen_global("open_editor", move |_| {
                editor_window.show().unwrap();
                launcher_window.hide().unwrap();
                editor::events::open(&editor_window).unwrap();
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            project::commands::create_project, 
            project::commands::open_project,
            project::commands::build_project,
            project::commands::get_project,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
