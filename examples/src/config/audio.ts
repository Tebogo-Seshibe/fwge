import { AudioPlayer } from "@fwge/audio"
import { Game } from "@fwge/core"

export function configureAudios(game: Game): void
{
    const audioLibrary = game.GetLibrary(AudioPlayer)

    audioLibrary.Add('Oof', new AudioPlayer({ source: '/assets/audio/Minecraft Death Sound Effect.mp3' }))
}
