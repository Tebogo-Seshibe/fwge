import GameObject from "../Object/GameObject"
import IConverter from "./IConverter"

export default class FBXConverter implements IConverter
{
    public Parse(fbx: string): GameObject
    {
        return null
    }
}