import type { Project } from "../utils/project/models";

export class ProjectHistory {
    constructor(
        public uuid: string,
        public name: string,
        public lastModfied: Date,
        public filePath: string
    ) { }
}

export class CurrentProject {
    constructor(
        public uuid: string,
        public config: Project,
    ) { }
}
