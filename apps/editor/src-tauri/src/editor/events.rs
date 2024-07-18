use std::sync::Mutex;

use tauri::{Error, Manager, Window};

use crate::project::models::project::Project;

use super::models::OpenPayload;
use super::ids::OPEN;

pub fn open(window: &Window) -> Result<(), Error> {
    window.emit(OPEN, OpenPayload {
        uuid: window.state::<Mutex<Project>>()
            .lock()
            .unwrap()
            .info.general.uuid.clone()
    }).unwrap();

    Ok(())
}
