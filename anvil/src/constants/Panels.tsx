import Config from "../modules/config"
import Editor from "../modules/editor"
import Script from "../modules/script"

export const Tabs: readonly string[] = [
  'Home',
  'Config',
  'Editor',
  'Script',
  'Settings',
] as const

export function getTab(tabName: string): JSX.Element
{
  switch (tabName)
  {
    case 'Home': return <></>
    case 'Config': return <Config />
    case 'Editor': return <Editor />
    case 'Script': return <Script />
    case 'Settings': return <></>
    default: return <>Whoops</>
  }
}
