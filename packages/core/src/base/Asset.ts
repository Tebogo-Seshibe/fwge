import { Game } from "./Game";

export interface Asset
{
    Load(game: Game): void;
    Unload(game: Game): void;    
    Destroy(game: Game): void;
}
