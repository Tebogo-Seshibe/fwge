use std::io::Error;

use serde::{ser::SerializeStruct, Serialize};
use yaml_rust2::YamlLoader;

pub struct FWGEProject {
    pub file_version: String,
    pub general: General,
    pub libraries: Libraries,
    pub build: Build
}

impl Serialize for FWGEProject {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("Target", 4)?;
            s.serialize_field("file_version", &self.file_version)?;
            s.serialize_field("general", &self.general)?;
            s.serialize_field("libraries", &self.libraries)?;
            s.serialize_field("build", &self.build)?;
            s.end()
    }
}

pub struct General {
    pub name: String,
    pub author: String
}

impl Serialize for General {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("General", 2)?;
            s.serialize_field("name", &self.name)?;
            s.serialize_field("author", &self.author)?;
            s.end()
    }
}

pub struct Libraries {
    pub internal: Vec<Library>,
    pub external: Vec<Library>
}

impl Serialize for Libraries {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("Libraries", 2)?;
            s.serialize_field("internal", &self.internal)?;
            s.serialize_field("external", &self.external)?;
            s.end()
    }
}

pub struct Library {
    pub display_name: String,
    pub name: String,
    pub version: String,
    pub source: String
}

impl Serialize for Library {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("Library", 4)?;
            s.serialize_field("display_name", &self.display_name)?;
            s.serialize_field("name", &self.name)?;
            s.serialize_field("version", &self.version)?;
            s.serialize_field("source", &self.source)?;
            s.end()
    }
}

pub struct Build {
    pub scripts: Scripts,
    pub targets: Vec<Target>
}

impl Serialize for Build {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("Build", 1)?;
            s.serialize_field("scripts", &self.scripts)?;
            s.serialize_field("targets", &self.targets)?;
            s.end()
    }
}

pub struct Scripts {
    pub debug: String,
    pub production: String
}

impl Serialize for Scripts {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("Scripts", 2)?;
            s.serialize_field("debug", &self.debug)?;
            s.serialize_field("production", &self.production)?;
            s.end()
    }
}

pub struct Target {
    pub platform: String,
    pub height: u8,
    pub width: u8
}

impl Serialize for Target {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
            let mut s = serializer.serialize_struct("Target", 3)?;
            s.serialize_field("platform", &self.platform)?;
            s.serialize_field("height", &self.height)?;
            s.serialize_field("width", &self.width)?;
            s.end()
    }
}

pub fn parseFWGEProject(contents: String) -> Result<FWGEProject, Error> {
    let &doc = match YamlLoader::load_from_str(&contents) {
        Ok(yaml) => yaml[0],
        Err(_) => return Err(Error::new(std::io::ErrorKind::Other, "Unable to load file"))
    };

    let file_version = doc["file-version"].as_str().unwrap().to_string();
    let general = General { 
        name: doc["general"]["name"].as_str().unwrap().to_string(),
        author: doc["general"]["author"].as_str().unwrap().to_string()
    };
    let internal: Vec<Library> = doc["libraries"]["internal"]
        .as_vec()
        .unwrap()
        .into_iter()
        .map(|lib| {
            Library {
                display_name: lib["display-name"].as_str().unwrap().to_string(),
                name: lib["name"].as_str().unwrap().to_string(),
                version: lib["version"].as_str().unwrap().to_string(),
                source: lib["source"].as_str().unwrap().to_string(),
            }
        })
        .collect();
    println!("{:?}", doc["libraries"]["internal"]);
    println!("{:?}", doc["libraries"]["external"]);
    let external: Vec<Library> = doc["libraries"]["external"]
        .as_vec()
        .unwrap_or(&Vec::new())
        .into_iter()
        .map(|lib| {
            Library {
                display_name: lib["display-name"].as_str().unwrap().to_string(),
                name: lib["name"].as_str().unwrap().to_string(),
                version: lib["version"].as_str().unwrap().to_string(),
                source: lib["source"].as_str().unwrap().to_string(),
            }
        })
        .collect();
    let scripts = Scripts {
        debug: doc["build"]["scripts"]["debug"].as_str().unwrap().to_string(),
        production: doc["build"]["scripts"]["production"].as_str().unwrap().to_string(),
    };
    let targets: Vec<Target> = doc["build"]["targets"]
        .as_vec()
        .unwrap()
        .into_iter()
        .map(|target| {
            Target {
                platform: target["platform"].as_str().unwrap().to_string(),
                height: 0,          //target["height"].as_i64(),
                width: 0            //target["width"].as_i64()
            }
        })
        .collect();

    Ok(FWGEProject { 
        file_version,
        general,
        libraries: Libraries { 
            internal,
            external
        },
        build: Build {
            scripts,
            targets
        }
    })
}