const {app, BrowserWindow} = require('electron')
const ipcLogin = require('./ipcLogin')
const ipcProducts = require('./ipcProducts')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({width:800, height:600, webPreferences: {nodeIntegration: true}})
    mainWindow.loadURL(`file://${__dirname}/../../views/index.html`)
    mainWindow.webContents.openDevTools()

    ipcLogin.communicate()
    ipcProducts.communicate()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)