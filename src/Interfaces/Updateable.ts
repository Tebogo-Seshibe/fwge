import FWGEEvent from '../Utility/FWGEEvent'

export default interface Updateable
{
    Update(): void
    
    BeforeUpdate(event: FWGEEvent): void 
    AftersUpdate(event: FWGEEvent): void 
}