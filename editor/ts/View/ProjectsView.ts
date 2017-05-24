import { View, IView } from './View';

export interface IProjectsView extends IView {}

export class ProjectsView extends View
{
    constructor(request: IProjectsView)
    {
        super(request);
    }
}