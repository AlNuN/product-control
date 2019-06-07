const {app, BrowserWindow, ipcMain} = require('electron')
const ipcLogin = require('./ipcLogin')
const ipcProducts = require('./ipcProducts')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        webPreferences: {nodeIntegration: true},
        frame: false,
        backgroundColor: '#505254'
    })

    // make the main window start maximized
    mainWindow.maximize()
    mainWindow.setResizable(false) // window always maximized
    mainWindow.show()

    // loads main page
    mainWindow.loadURL(`file://${__dirname}/../../views/index.html`)
    mainWindow.webContents.openDevTools()

    // Login and products database operations
    ipcLogin.communicate()
    ipcProducts.communicate()

    ipcMain.on('bar-message',(event, arg)=>{ 
        let x = (arg) ? mainWindow.minimize() : mainWindow.close()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)
