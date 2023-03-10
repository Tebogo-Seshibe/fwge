export class InvalidArgumentsException extends Error
{
    static readonly ERROR_MESSAGE: string = 'Invalid arguments provided';
    
    constructor()
    {
        super(InvalidArgumentsException.ERROR_MESSAGE);
    }
}
