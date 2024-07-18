use super::{config::Config, info::Info, resources::Resources};

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Project {
    pub info: Info,
    pub resources: Resources,
    pub config: Config
}
