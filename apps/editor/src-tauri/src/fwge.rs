pub mod models;
pub mod commands;

// use serde::{ser::SerializeStruct, Serialize};
// use yaml_rust2::YamlLoader;

// #[derive(Default, Clone, Serialize)]
// pub struct FWGEProject {
//     pub file_version: String,
//     pub general: General,
//     pub libraries: Libraries,
//     pub build: Build
// }

// impl FWGEProject {
//     fn default() -> Self {
//         Self { 
//             file_version: Default::default(),
//             general: Default::default(),
//             libraries: Default::default(),
//             build: Default::default()
//         }
//     }
    
//     fn clone(&self) -> Self {
//         Self { 
//             file_version: self.file_version.clone(), 
//             general: self.general.clone(), 
//             libraries: self.libraries.clone(), 
//             build: self.build.clone() 
//         }
//     }
    
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("Target", 4)?;
//             s.serialize_field("file_version", &self.file_version)?;
//             s.serialize_field("general", &self.general)?;
//             s.serialize_field("libraries", &self.libraries)?;
//             s.serialize_field("build", &self.build)?;
//             s.end()
//     }
// }

// #[derive(Default, Clone, Serialize)]
// pub struct General {
//     pub name: String,
//     pub author: String,
//     pub location: String
// }

// impl General {
//     fn default() -> Self {
//         Self { 
//             name: Default::default(), 
//             author: Default::default(), 
//             location: Default::default() 
//         }
//     }
    
//     fn clone(&self) -> Self {
//         Self { 
//             name: self.name.clone(), 
//             author: self.author.clone(), 
//             location: self.location.clone() 
//         }
//     }
    
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("General", 3)?;
//             s.serialize_field("name", &self.name)?;
//             s.serialize_field("author", &self.author)?;
//             s.serialize_field("location", &self.location)?;
//             s.end()
//     }
// }

// #[derive(Default, Clone, Serialize)]
// pub struct Libraries {
//     pub internal: Vec<Library>,
//     pub external: Vec<Library>
// }

// impl Libraries {
//     fn default() -> Self {
//         Self { 
//             internal: Default::default(),
//             external: Default::default(),
//         }
//     }

//     fn clone(&self) -> Self {
//         Self { 
//             internal: self.internal.clone(), 
//             external: self.external.clone() 
//         }
//     }
    
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("Libraries", 2)?;
//             s.serialize_field("internal", &self.internal)?;
//             s.serialize_field("external", &self.external)?;
//             s.end()
//     }
// }

// #[derive(Default, Clone, Serialize)]
// pub struct Library {
//     pub display_name: String,
//     pub name: String,
//     pub version: String,
//     pub source: String
// }

// impl Library {
//     fn default() -> Self {
//         Self { 
//             display_name: Default::default(),
//             name: Default::default(),
//             version: Default::default(),
//             source: Default::default()
//         }
//     }

//     fn clone(&self) -> Self {
//         Self { 
//             display_name: self.display_name.clone(), 
//             name: self.name.clone(), 
//             version: self.version.clone(), 
//             source: self.source.clone() 
//         }
//     }

//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("Library", 4)?;
//             s.serialize_field("display_name", &self.display_name)?;
//             s.serialize_field("name", &self.name)?;
//             s.serialize_field("version", &self.version)?;
//             s.serialize_field("source", &self.source)?;
//             s.end()
//     }
// }

// #[derive(Default, Clone, Serialize)]
// pub struct Build {
//     pub scripts: Scripts,
//     pub targets: Vec<Target>
// }

// impl Build {
//     fn clone(&self) -> Self {
//         Self { 
//             scripts: self.scripts.clone(), 
//             targets: self.targets.clone() 
//         }
//     }
    
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("Build", 1)?;
//             s.serialize_field("scripts", &self.scripts)?;
//             s.serialize_field("targets", &self.targets)?;
//             s.end()
//     }
// }

// #[derive(Default, Clone, Serialize)]
// pub struct Scripts {
//     pub debug: String,
//     pub production: String
// }

// impl Scripts {
//     fn default() -> Self {
//         Self { 
//             debug: Default::default(),
//             production: Default::default(),
//         }
//     }

//     fn clone(&self) -> Self {
//         Self { 
//             debug: self.debug.clone(), 
//             production: self.production.clone() 
//         }
//     }
    
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("Scripts", 2)?;
//             s.serialize_field("debug", &self.debug)?;
//             s.serialize_field("production", &self.production)?;
//             s.end()
//     }
// }

// #[derive(Default, Clone, Serialize)]
// pub struct Target {
//     pub platform: String,
//     pub height: i64,
//     pub width: i64
// }

// impl Target {
//     fn default() -> Self {
//         Self { 
//             platform: Default::default(),
//             height: Default::default(),
//             width: Default::default(),
//         }
//     }

//     fn clone(&self) -> Self {
//         Self { 
//             platform: self.platform.clone(), 
//             height: self.height.clone(), 
//             width: self.width.clone() 
//         }
//     }

//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::Serializer {
//             let mut s = serializer.serialize_struct("Target", 3)?;
//             s.serialize_field("platform", &self.platform)?;
//             s.serialize_field("height", &self.height)?;
//             s.serialize_field("width", &self.width)?;
//             s.end()
//     }
// }

// pub fn parse_fwgeproject(contents: String) -> Result<FWGEProject, String> {
//     let doc = match YamlLoader::load_from_str(&contents) {
//         Ok(yaml) => yaml[0].to_owned(),
//         Err(_) => return Err("Unable to load file".to_string())
//     };

//     let file_version = doc["file-version"].as_str().unwrap_or_default().to_string();
//     let general = General { 
//         name: doc["general"]["name"].as_str().unwrap_or_default().to_string(),
//         author: doc["general"]["author"].as_str().unwrap_or_default().to_string(),
//         location: doc["general"]["location"].as_str().unwrap_or_default().to_string()
//     };
//     let internal: Vec<Library> = doc["libraries"]["internal"]
//         .as_vec()
//         .unwrap_or(&Vec::new())
//         .into_iter()
//         .map(|lib| {
//             Library {
//                 display_name: lib["display-name"].as_str().unwrap_or_default().to_string(),
//                 name: lib["name"].as_str().unwrap_or_default().to_string(),
//                 version: lib["version"].as_str().unwrap_or_default().to_string(),
//                 source: lib["source"].as_str().unwrap_or_default().to_string(),
//             }
//         })
//         .collect();
    
//     let external: Vec<Library> = doc["libraries"]["external"]
//         .as_vec()
//         .unwrap_or(&Vec::new())
//         .into_iter()
//         .map(|lib| {
//             Library {
//                 display_name: lib["display-name"].as_str().unwrap_or_default().to_string(),
//                 name: lib["name"].as_str().unwrap_or_default().to_string(),
//                 version: lib["version"].as_str().unwrap_or_default().to_string(),
//                 source: lib["source"].as_str().unwrap_or_default().to_string(),
//             }
//         })
//         .collect();
//     let scripts = Scripts {
//         debug: doc["build"]["scripts"]["debug"].as_str().unwrap_or_default().to_string(),
//         production: doc["build"]["scripts"]["production"].as_str().unwrap_or_default().to_string(),
//     };
//     let targets: Vec<Target> = doc["build"]["targets"]
//         .as_vec()
//         .unwrap_or(&Vec::new())
//         .into_iter()
//         .map(|target| {
//             Target {
//                 platform: target["platform"].as_str().unwrap_or_default().to_string(),
//                 height: target["height"].as_i64().unwrap_or_default(),
//                 width: target["width"].as_i64().unwrap_or_default()
//             }
//         })
//         .collect();

//     Ok(FWGEProject { 
//         file_version,
//         general,
//         libraries: Libraries { 
//             internal,
//             external
//         },
//         build: Build {
//             scripts,
//             targets
//         }
//     })
// }
