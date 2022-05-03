import { Game, Script, Tag, Transform } from '@fwge/core'
import { Input } from '@fwge/input'
import { Camera, Material, Mesh, PointLight, Shader } from '@fwge/render'
import React, { createContext } from 'react'

type GameContextType =
{
  game: Game | null
  updateGame: React.Dispatch<Game | null>
}

export const defaultGame: Game | null = new Game({
    components:
    [
        Transform,
        Mesh,
        Material,
        Shader,
        Tag,
        Script,
        PointLight,
        Camera,
        Input
    ],
    libraries:
    [
        Mesh,
        Material,
        Shader,
        Script
    ]
})

export const GameContext = createContext<GameContextType>({ game: defaultGame, updateGame: () => void 0 })
