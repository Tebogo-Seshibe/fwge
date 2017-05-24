import { View, IView } from './View';

export interface IWindowView extends IView {}

export class WindowView extends View
{
    constructor(request: IWindowView)
    {
        super(request);
    }
}