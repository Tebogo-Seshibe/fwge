import Viewer from '../src/Camera/Viewer'
import { expect } from 'chai'
import { describe , it } from 'mocha'

describe('Animation', () =>
{
    describe('New Animation', () =>
    {
        let viewer = new Viewer()
        // viewer.Update()

        it('View Matrix should be: [ [ ], [ ], [ ] ]', () => expect(viewer).is.not.null)
    })
})