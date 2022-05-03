import { Game } from "@fwge/core"
import { useState } from "react"
import { defaultGame, GameContext } from "./context"

interface GameProviderProps
{
  children: React.ReactNode[]
}

export function GameProvider({ children }: GameProviderProps)
{
  const [game, updateGame] = useState<Game | null>(defaultGame)

  return (
    <GameContext.Provider value={{ game, updateGame }}>
      { children }
    </GameContext.Provider>
  )
}
