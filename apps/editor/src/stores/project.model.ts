import type { FWGEProject } from "../utils/fwge/models";

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
        public config: FWGEProject,
    ) { }
}
