use std::sync::Mutex;

use tauri::{Error, Manager, Window};

use crate::fwge::models::FWGEProject;

use super::models::OpenPayload;
use super::ids::OPEN;

pub fn open(window: &Window) -> Result<(), Error> {
    window.emit_to(window.label(), OPEN, OpenPayload {
        uuid: window.state::<Mutex<FWGEProject>>()
            .lock()
            .unwrap()
            .general.uuid.clone()
    }).unwrap();

    Ok(())
}
