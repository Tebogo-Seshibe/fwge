#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Info {
    pub file_version: String,
    pub general: General,
    pub meta: Meta,
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct General {
    pub uuid: String,
    pub name: String,
    pub version: String,
    pub author: String,
    pub base_path: String,
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Meta {
    pub date_modified: Option<String>,
    pub thumbnail: String,
}