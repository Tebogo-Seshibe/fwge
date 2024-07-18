export interface Project {
    info: Info,
    resources: Resources,
    config: Config,
}

export interface Info {
    file_version: string,
    general: General,
    meta: Meta,
}

export interface General {
    uuid: string,
    name: string,
    version: string,
    author: string,
    base_path: string,
}

export interface Meta {
    date_modified?: string,
    thumbnail: string,
}

export interface Resources {
    libraries: Libraries,
    sources: Source[],
}

export interface Libraries {
    internal: Package[],
    external: Package[],
}

export interface Package {
    display_name: string,
    name: string,
    version: string,
    source: string,
}

export interface Source {
    uuid: string,
    name: string,
    path: string,
    type: string,
}

export interface Config {
    height: number,
    width: number,
    startup_scene: number,
    scripts: Scripts,
    target: string[],
}

export interface Scripts {
    debug: string,
    build: string,
}
