import FWGE from '../src/FWGE'
import { expect } from 'chai'
import { JSDOM } from  'jsdom'
import { describe , it } from 'mocha'

let dom = new JSDOM(
`<!DOCTYPE html>
<html lang="en">
    <head>
        <title>FWGE</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
    </head>
    <body>
        <canvas height="1080" width="1920" id="canvas"></canvas>
    </body>
</html>`)

export default () =>
{
    describe('FWGE', () =>
    {
        describe('Init', () =>
        {
            //FWGE.Init({ canvas: dom.window.document.getElementById('canvas') as HTMLCanvasElement})

            it('should have been initialized', () =>
            {
                expect(FWGE).not.null
            })
        })
    })
}