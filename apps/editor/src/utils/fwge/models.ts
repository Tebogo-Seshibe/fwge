export interface ClassDefinition {
    name: string,
    code: string
}

export interface FWGEProjectInfo {
    project_uuid: string,
    project_name: string,
    file_path: string,
    project_thumbnail: string,
}

export interface FWGEProject {
    file_version: string
    general: General
    libraries: Libraries
    build: Build
}

export interface General {
    uuid: string
    name: string
    author: string
    version: string
}

export interface Libraries {
    internal: Library[]
    external: Library[]
}

export interface Library {
    display_name: string
    name: string
    version: string
    source: string
}

export interface Build {
    scripts: Scripts
    targets: Target[]
}

export interface Scripts {
    debug: string
    production: string
}

export interface Target {
    platform: string
    height: number
    width: number
}
