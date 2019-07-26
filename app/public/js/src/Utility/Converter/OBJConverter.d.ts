import Converter from './Converter';
import Mesh from '../../Render/Mesh';
import GameObject from '../../GameObject';
import RenderMaterial from '../../Render/RenderMaterial';
export default class OBJConverter implements Converter {
    static Parse(obj: string, mtl: string): GameObject;
    static ParseMesh(obj: string): Mesh;
    static ParseRenderMaterial(mtl: string): RenderMaterial;
}
