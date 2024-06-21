use yaml_rust2::YamlLoader;

#[derive(Clone, Default, serde::Serialize)]
pub struct FWGEProjectInfo {
    pub file_path: String,
    pub project_name: String,
    pub project_thumbnail: String
}

#[derive(Clone, Default, serde::Serialize)]
pub struct FWGEProject {
    pub file_version: String,
    pub general: General,
    pub libraries: Libraries,
    pub build: Build
}

#[derive(Clone, Default, serde::Serialize)]
pub struct General {
    pub name: String,
    pub author: String,
    pub location: String
}

#[derive(Clone, Default, serde::Serialize)]
pub struct Libraries {
    pub internal: Vec<Library>,
    pub external: Vec<Library>
}

#[derive(Clone, Default, serde::Serialize)]
pub struct Library {
    pub display_name: String,
    pub name: String,
    pub version: String,
    pub source: String
}

#[derive(Clone, Default, serde::Serialize)]
pub struct Build {
    pub scripts: Scripts,
    pub targets: Vec<Target>
}

#[derive(Clone, Default, serde::Serialize)]
pub struct Scripts {
    pub debug: String,
    pub production: String
}

#[derive(Clone, Default, serde::Serialize)]
pub struct Target {
    pub platform: String,
    pub height: i64,
    pub width: i64
}

pub fn parse_fwgeproject(contents: String) -> Result<FWGEProject, String> {
    let doc = match YamlLoader::load_from_str(&contents) {
        Ok(yaml) => yaml[0].to_owned(),
        Err(_) => return Err("Unable to load file".to_string())
    };

    let file_version = doc["file-version"].as_str().unwrap_or_default().to_string();
    let general = General { 
        name: doc["general"]["name"].as_str().unwrap_or_default().to_string(),
        author: doc["general"]["author"].as_str().unwrap_or_default().to_string(),
        location: doc["general"]["location"].as_str().unwrap_or_default().to_string()
    };
    let internal: Vec<Library> = doc["libraries"]["internal"]
        .as_vec()
        .unwrap_or(&Vec::new())
        .into_iter()
        .map(|lib| {
            Library {
                display_name: lib["display-name"].as_str().unwrap_or_default().to_string(),
                name: lib["name"].as_str().unwrap_or_default().to_string(),
                version: lib["version"].as_str().unwrap_or_default().to_string(),
                source: lib["source"].as_str().unwrap_or_default().to_string(),
            }
        })
        .collect();
    
    let external: Vec<Library> = doc["libraries"]["external"]
        .as_vec()
        .unwrap_or(&Vec::new())
        .into_iter()
        .map(|lib| {
            Library {
                display_name: lib["display-name"].as_str().unwrap_or_default().to_string(),
                name: lib["name"].as_str().unwrap_or_default().to_string(),
                version: lib["version"].as_str().unwrap_or_default().to_string(),
                source: lib["source"].as_str().unwrap_or_default().to_string(),
            }
        })
        .collect();
    let scripts = Scripts {
        debug: doc["build"]["scripts"]["debug"].as_str().unwrap_or_default().to_string(),
        production: doc["build"]["scripts"]["production"].as_str().unwrap_or_default().to_string(),
    };
    let targets: Vec<Target> = doc["build"]["targets"]
        .as_vec()
        .unwrap_or(&Vec::new())
        .into_iter()
        .map(|target| {
            Target {
                platform: target["platform"].as_str().unwrap_or_default().to_string(),
                height: target["height"].as_i64().unwrap_or_default(),
                width: target["width"].as_i64().unwrap_or_default()
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
