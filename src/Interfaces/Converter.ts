import { GameObject } from '../Game Engine/GameObject';
import { Mesh } from '../Render Engine/Mesh';
import { RenderMaterial } from '../Render Engine/RenderMaterial';

export class Converter
{
    protected Read(path: string): string
    {
        let xml = new XMLHttpRequest();

        xml.open('GET', path, false);
        xml.send(null);
        
        return xml.responseText;
    }

    public Parse(...files: string[]): GameObject { return };
    protected GameObject(...args: any[]): GameObject { return };
    protected Mesh(...args: any[]): Mesh { return };
    protected RenderMaterial(...args: any[]): RenderMaterial { return };
}