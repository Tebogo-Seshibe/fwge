import { GameState } from "./models"

export interface GameStateAction
{
  type: string;
  state: Partial<GameState>
}

export function GameStateReducer(state: GameState, action: GameStateAction): GameState | null
{
  throw new Error('Not implemented')
}
