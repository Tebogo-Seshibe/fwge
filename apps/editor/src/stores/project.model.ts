export class ProjectHistory {
    constructor(
        public projectId: number,
        public name: string,
        public lastModfied: Date,
        public filePath: string
    ) { }
}