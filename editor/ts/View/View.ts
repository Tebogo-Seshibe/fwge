export interface IView
{
    Element: HTMLElement;
}

export class View
{
    public Element: HTMLElement;

    constructor(request: IView)
    {
        this.Element = request.Element;
    }
}