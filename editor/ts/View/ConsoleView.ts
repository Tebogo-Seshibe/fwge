import { View, IView } from './View';

export interface IConsoleView extends IView { }

export class ConsoleView extends View
{
    constructor(request: IConsoleView)
    {
        super(request);
    }
}