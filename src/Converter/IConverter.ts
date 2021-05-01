import GameObject from '../Object/GameObject';

export default interface IConverter
{
    Parse(...filenames: string[]):  GameObject
}