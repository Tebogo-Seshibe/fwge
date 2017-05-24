interface IView
{
    Element: HTMLElement;
}

class View
{
    public Element: HTMLElement;

    constructor(request: IView)
    {
        this.Element = request.Element;
    }
}


interface IProjectsView extends IView {}

class ProjectsView extends View
{
    constructor(request: IProjectsView)
    {
        super(request);
    }
}


interface IWindowView extends IView {}

class WindowView extends View
{
    constructor(request: IWindowView)
    {
        super(request);
    }
}


interface IConsoleView extends IView { }

class ConsoleView extends View
{
    constructor(request: IConsoleView)
    {
        super(request);
    }
}
class Editor
{
    constructor()
    {
        
    }
}