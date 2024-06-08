use std::process::Stdio;

pub fn cli(command: Vec<&str>) -> String {
    let result = std::process::Command::new("node")
        .arg("../../cli/bin/fwge")
        .args(command)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()
        .expect("failed to execute process");

    let output = match result.status.success() {
        true => result.stdout,
        false => result.stderr,
    };

    match String::from_utf8(output) {
        Ok(s) => s,
        Err(_) => String::from("failed to parse command output"),
    }
}
