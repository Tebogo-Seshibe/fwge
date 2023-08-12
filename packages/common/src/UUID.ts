export function CreateUUID(): UUID;
export function CreateUUID(uuid: string): UUID;
export function CreateUUID(uuid?: string): UUID
{
    if (!uuid)
    {
        let date = Date.now() + '';
        let rand = (Math.random() + '').substring(2);
        uuid = '';

        while (true)
        {
            const useDate = Math.floor(Math.random() * 10) % 2 === 0;
            let curr = useDate ? date : rand;
            let other = !useDate ? date : rand;

            if (curr.length === 0)
            {
                uuid += other;
                break;
            }
            else
            {
                uuid += curr[0];
                if (useDate)
                {
                    date = date.substring(1);
                }
                else
                {
                    rand = rand.substring(1);
                }
            }
        }
    }

    return BigInt(uuid);
}

export type UUID = bigint;
