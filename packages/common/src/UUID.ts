const offset = 1000000000000000

export class UUID
{
    private constructor(private _id: bigint){}

    Equals(other: UUID): boolean
    {
        return this._id === other._id
    }

    static Zero(): UUID
    {
        return new UUID(BigInt(0))
    }

    static Create(): UUID
    static Create(uuid: string): UUID
    static Create(uuid?: string): UUID
    {
        if (!uuid)
        {
            let date = Date.now() + ''
            let rand = (Math.random()  + '').substring(2)
            uuid = ''

            while (true)
            {
                const useDate = Math.floor(Math.random() * 10) % 2 === 0
                let curr = useDate ? date : rand
                let other = !useDate ? date : rand
                
                if (curr.length === 0)
                {
                    uuid += other
                    break
                }
                else
                {
                    uuid += curr[0]
                    if (useDate)
                    {
                        date = date.substring(1)
                    }
                    else
                    {
                        rand = rand.substring(1)
                    }
                }
            }
        }

        return new UUID(BigInt(uuid))
    }
}

(window as any).UUID = UUID