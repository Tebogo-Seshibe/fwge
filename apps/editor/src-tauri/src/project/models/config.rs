#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Config {
    pub height: u64,
    pub width: u64,
    pub startup_scene: u64,
    pub scripts: Scripts,
    pub targets: Vec<String>,
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Scripts {
    pub debug: String,
    pub build: String,
}
