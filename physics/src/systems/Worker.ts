import { CollisionResult, CollisionTest, DetectResolveType } from "./types"


export const handleData = (args: { data: CollisionTest[] }) => 
{
    const m = new Map()
    for (const testCase of args.data)
    {
        let res: CollisionResult = [0,0,0,0,0,0]
        switch (testCase[0])
        {
            case 0:
                const leftId = testCase[1]
                const rightId = testCase[2]
                const leftPos: [number, number, number] = [testCase[3], testCase[4], testCase[5]]
                const leftRad: number = testCase[6]
                const rightPos: [number, number, number] = [testCase[7], testCase[8], testCase[9]]
                const rightRad: number = testCase[10]
                if (self.detect_SS(leftPos, leftRad, rightPos, rightRad))
                {
                    res = self.resolve_SS(leftPos, leftRad, rightPos, rightRad)
                }

                if (!m.has(leftId))
                {
                    m.set(leftId, [0,0,0])
                }

                if (!m.has(rightId))
                {
                    m.set(rightId, [0,0,0])
                }
                const leftCurrDisplacement = m.get(leftId)
                const rightCurrDisplacement = m.get(rightId)

                m.set(leftId, [
                    leftCurrDisplacement[0] + res[0],
                    leftCurrDisplacement[1] + res[1],
                    leftCurrDisplacement[2] + res[2],
                ])
                m.set(rightId, [
                    rightCurrDisplacement[0] + res[3],
                    rightCurrDisplacement[1] + res[4],
                    rightCurrDisplacement[2] + res[5],
                ])
                break;
        }
    }
    postMessage(m)
    // console.log(args.data)
    // self.detect_SS
    // console.log(self.detect_SS)
    // console.log(args.data)
    // const _detect = (<any>self)[detect] as CollisionDetectMethod
    // const _resolve = (<any>self)[resolve] as CollisionResovleMethod
    // console.log(_detect(leftPosition, leftCollider, rightPosition, rightCollider))
    // if (_detect(leftPosition, leftCollider, rightPosition, rightCollider))
    // {
    //     _resolve(leftPosition, leftCollider, rightPosition, rightCollider)
    // }
    // postMessage()
}
