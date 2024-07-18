use std::{fs, io::Write, ops::Add, process::Stdio};

use super::{models::project::Project, templates};

pub fn parse_project_file(contents: &str) -> Result<Project, String> {
    match serde_yml::from_str(contents) {
        Ok(project) => Ok(project),
        Err(err) => Err(String::from("Failed to parse project file\n\r").add(&err.to_string())),
    }
}

pub fn create_template_files(base_path: &str, project_name: &str, project: &Project) -> Result<(), String> {
    fs::create_dir([base_path, "src"].join("/")).unwrap();
    fs::create_dir([base_path, "src", "assets"].join("/")).unwrap();
    fs::create_dir([base_path, "src", "components"].join("/")).unwrap();
    fs::create_dir([base_path, "src", "decorators"].join("/")).unwrap();
    fs::create_dir([base_path, "src", "entities"].join("/")).unwrap();
    fs::create_dir([base_path, "src", "scenes"].join("/")).unwrap();
    fs::create_dir([base_path, "src", "systems"].join("/")).unwrap();

    fs::File::create_new([base_path, ".gitignore"].join("/"))
        .unwrap()
        .write(templates::GITIGNORE)
        .unwrap();

    fs::File::create_new([base_path, "package.json"].join("/"))
        .unwrap()
        .write(templates::PACKAGE_JSON)
        .unwrap();

    fs::File::create_new([base_path, "tsconfig.json"].join("/"))
        .unwrap()
        .write(templates::TSCONFIG_JSON)
        .unwrap();

    fs::File::create_new([base_path, "index.html"].join("/"))
        .unwrap()
        .write(templates::INDEX_HTML)
        .unwrap();

    fs::File::create_new([base_path, &[project_name, "yml"].join(".")].join("/"))
        .unwrap()
        .write(&serde_yml::to_string(project).unwrap().into_bytes())
        .unwrap();    

    fs::File::create_new([base_path, "src", "main.ts"].join("/"))
        .unwrap()
        .write(templates::MAIN_TS)
        .unwrap();
    fs::File::create_new([base_path, "src", "Project.ts"].join("/"))
        .unwrap()
        .write(templates::PROJECT_TS)
        .unwrap();
    
    fs::File::create_new([base_path, "src", "scenes", "MainScene.ts"].join("/"))
        .unwrap()
        .write(templates::MAINSCENE_TS)
        .unwrap();

    Ok(())
}

pub fn npm(args: Vec<&str>, working_dir: &str) -> Result<String, String> {
    let mut command =  if cfg!(target_os = "windows") {
        std::process::Command::new("npm.cmd")
    } else {
        std::process::Command::new("npm")
    };
    
    let result = command
        .current_dir(working_dir)
        .args(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output();

    let output = match result {
        Ok(output) => output,
        Err(err) => return Err(String::from("Failed to execute command\n\r").add(&err.to_string())),
    };

    let bytes = if output.status.success() {
        output.stdout
    } else {
        output.stderr
    };

    match String::from_utf8(bytes) {
        Ok(output) => Ok(output),
        Err(err) => Err(String::from("Failed to parse command output\n\r").add(&err.to_string()))
    }
}
