import Animation from '../src/Animation/Animation'
import AnimationFrame from '../src/Animation/AnimationFrame'
import Colour4 from '../src/Render/Colour4'
import RenderMaterial from '../src/Render/RenderMaterial'
import { expect } from 'chai'
import { describe , it } from 'mocha'

export default () =>
{
    describe('Animation', () =>
    {
        describe('New Animation', () =>
        {
            let animation = new Animation(
            {
                frames:
                [
                    new AnimationFrame<Colour4>({ before: new Colour4(), after: new Colour4(), time: 1 }),
                    new AnimationFrame<Colour4>({ before: new Colour4(), after: new Colour4(), time: 2 }),
                    new AnimationFrame<Colour4>({ before: new Colour4(), after: new Colour4(), time: 3 }),
                    new AnimationFrame<Colour4>({ before: new Colour4(), after: new Colour4(), time: 4 })
                ],

                mesh: null,

                material: new RenderMaterial(
                {

                }),
                
                length: 5
            })
                
            it('A new Animation(params) should not be null', () => expect(animation).is.not.null)
        })
    })
}