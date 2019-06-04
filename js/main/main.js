const {app, BrowserWindow} = require('electron')
const ipcLogin = require('./ipcLogin')
const ipcProducts = require('./ipcProducts')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({width:800, height:600, webPreferences: {nodeIntegration: true}})

    // make the main window start maximized
    mainWindow.maximize()
    mainWindow.show()
    // mainWindow.setResizable(false) // window always maximized

    // loads main page
    mainWindow.loadURL(`file://${__dirname}/../../views/index.html`)
    mainWindow.webContents.openDevTools()

    // Login and products database operations
    ipcLogin.communicate()
    ipcProducts.communicate()

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)