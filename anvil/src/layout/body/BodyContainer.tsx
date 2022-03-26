import { Grid } from "@mantine/core"
import React from "react"
import { style } from './style'

interface BodyContainerProps
{
  children: JSX.Element | JSX.Element[]
}

export function BodyContainer({ children }: BodyContainerProps)
{
  const { classes } = style()

  return (
    <Grid>
      { children }
    </Grid>
  )
}
