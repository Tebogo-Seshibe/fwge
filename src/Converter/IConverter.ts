import GameObject from '../Object/GameObject';

export default interface IConverter
{
    Parse(...text: string[]):  GameObject
}