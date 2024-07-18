#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Resources {
    pub libraries: Libraries,
    pub sources: Vec<Source>
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Libraries {
    pub internal: Vec<Package>,
    pub external: Vec<Package>,
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Package {
    pub display_name: String,
    pub name: String,
    pub version: String,
    pub source: String,
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub struct Source {
    pub uuid: String,
    pub name: String,
    pub path: String,
    pub r#type: String, //SourceType
}

#[derive(Clone, Default, serde::Serialize, serde::Deserialize)]
pub enum SourceType {
    #[default] None,
    Project,
    Scene,
    Entity,
    Prefab,
    System,
    Asset
}
