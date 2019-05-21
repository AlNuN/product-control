const {app, BrowserWindow} = require('electron')
const routes = require('electron-routes')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow


function createWindow() {
    mainWindow = new BrowserWindow({width:800, height:600, webSecurity:false})
    mainWindow.ELECTRON_DISABLE_SECURITY_WARNINGS
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)