import { MantineProvider } from '@mantine/core'
import { useState } from 'react'
import './App.css'
import { getTab, Tabs } from './constants/Panels'
import BodyContainer from './layout/body'
import HeaderContainer from './layout/header'
import GameProvider from './providers/Game'

export default function App()
{
  const [activeTab, setActiveTab] = useState<string>('')
  const currentTab = getTab(activeTab)

  return (
    <MantineProvider>
      <GameProvider>
        <HeaderContainer
          activeTab={ activeTab }
          changeTab={ setActiveTab }
          tabs={ Tabs }
        />

        <BodyContainer>
          { currentTab }
        </BodyContainer>
      </GameProvider>
    </MantineProvider>
  )
}
