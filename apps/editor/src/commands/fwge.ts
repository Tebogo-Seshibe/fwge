export interface FWGEProject {
    file_version: string,
    general: General,
    libraries: Libraries,
    build: Build
}

export interface General {
    name: string,
    author: string
}

export interface Libraries {
    internal: Array<Library>,
    external: Array<Library>
}

export interface Library {
    display_name: string,
    name: string,
    version: string,
    source: string
}

export interface Build {
    scripts: Scripts,
    targets: Array<Target>
}

export interface Scripts {
    debug: string,
    production: string
}

export interface Target {
    platform: string,
    height: number,
    width: number
}
