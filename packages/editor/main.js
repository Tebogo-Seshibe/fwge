const { app, BrowserWindow, Menu, MenuItem } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

const isIos = process.platform === 'darwin'
const template = [
    {
      label: 'File',
      
      submenu: [
        { label: 'New Scene' },
        { label: 'Open Scene' },
        { label: 'Save Scene' },
        { label: 'Open Recent Scene' },

        { type: 'separator' },

        { label: 'New Project' },
        { label: 'Open Project' },
        { label: 'Save Project' },
        { label: 'Build Project' },

        { type: 'separator' },

        { label: 'Preferences' },
        { role: 'quit' }
      ]
    },
    
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },

        { type: 'separator' },

        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },

        { type: 'separator' },

        { role: 'selectAll' }
      ]
    },
    
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { label: 'Panels' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    },
    {
        label: 'Panel',
        submenu: [
            { label: 'Hierachy' },
            { label: 'Scene View' },
            { label: 'Game View' },
            { label: 'Inspector' },
        ]
    }
  ]
  
const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)
function createWindow()
{
    const mainWindow = new BrowserWindow(
    {
        minWidth: 1200,
        minHeight: 800,
        webPreferences:
        {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    isDev ? mainWindow.loadURL('http://localhost:8080') : mainWindow.loadFile('dist/index.html')
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(function ()
{
    createWindow()

    app.on('activate', function ()
    {
        if (BrowserWindow.getAllWindows().length === 0)
        {
            createWindow()
        }
    })
})

app.on('window-all-closed', function ()
{
    if (!isIos) app.quit()
})
