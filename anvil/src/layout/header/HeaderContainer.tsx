import { Container, Tabs } from '@mantine/core'
import React from 'react'
import { style } from './style'

interface HeaderProps
{
  activeTab: string
  tabs: readonly string[]
  changeTab: (tab: string) => void
}

export function HeaderContainer({ activeTab, tabs, changeTab }: HeaderProps)
{
  const { classes } = style();

  const items = tabs.map((tab: string) => 
    <Tabs.Tab
      label={ tab }
      key={ tab }
    />
  );

  return (
    <div className={ classes.header }>
      <Container>
        <Tabs
          active={ tabs.indexOf(activeTab) }
          onTabChange={ index => changeTab(tabs[index]) }
          variant="outline"
          classNames={{
            root: classes.tabs,
            tabsListWrapper: classes.tabsList,
            tabControl: classes.tabControl,
            tabActive: classes.tabControlActive,
          }}
        >
          { items }
        </Tabs>
      </Container>
    </div>
  )
}
