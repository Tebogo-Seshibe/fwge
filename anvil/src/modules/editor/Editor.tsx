import { Grid } from "@mantine/core"
import React, { useContext, useEffect, useRef } from "react"
import { GameContext } from "../../providers/Game"

interface SceneItem
{
  guid: string;
  name: string;
  systems: string[]
  entities: EntityItem[];
}

interface EntityItem
{
  guid: string;
  name: string;
  children?: EntityItem[];
}

export function Editor()
{
  const canvasRef = useRef<HTMLCanvasElement>()
  const { game } = useContext(GameContext)

  console.log(game)

  useEffect(() =>
  {
    if (canvasRef.current)
    {
      console.log(canvasRef.current)
      game!.SetCanvas(canvasRef.current)
      game?.Start()
    }
    else
    {
        game?.Stop()
    }
  }, [ game, canvasRef ])

  return (
    <Grid m={ 0 }>
      <Grid.Col p={ 0 } span={ 2 } style={{ height: 'calc(100vh - 50px)'}}>
        <Grid.Col p={ 0 } span={ 12 } style={{ height: '70%' }}>
        </Grid.Col>

        <Grid.Col p={ 0 } span={ 12 } style={{ height: '30%' }}>
          <div style={{ height: '100%' }}></div>
        </Grid.Col>
      </Grid.Col>

      <Grid.Col p={ 0 } span={ 8 } style={{ height: 'calc(100vh - 50px)'}}>
        <Grid.Col p={ 0 } span={ 12 } style={{ height: '50%' }}>
          <canvas ref={ canvasRef } style={{ height: '100%' }}></canvas>
        </Grid.Col>
        <Grid.Col p={ 0 } span={ 12 } style={{ height: '50%' }}>
          <canvas style={{ height: '100%' }}></canvas>
        </Grid.Col>
      </Grid.Col>

      <Grid.Col p={ 0 } span={ 2 } style={{ height: 'calc(100vh - 50px)'}}>
        <Grid.Col p={ 0 }span={ 12 } style={{ height: '60%' }}>
          <div style={{ height: '100%' }}></div>
        </Grid.Col>
        <Grid.Col p={ 0 } span={ 12 } style={{ height: '40%' }}>
          <div style={{ height: '100%' }}></div>
        </Grid.Col>
      </Grid.Col>        
    </Grid>
  )
}
