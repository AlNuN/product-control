const {app, BrowserWindow, ipcMain} = require('electron')
const ipcLogin = require('./ipcLogin')
const ipcProducts = require('./ipcProducts')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width:800,
        height:600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {nodeIntegration: true},
        frame: false,
        backgroundColor: '#505254'
    })

    // loads main page
    mainWindow.loadURL(`file://${__dirname}/../../views/index.html`)

    // Login and products database operations
    ipcLogin.communicate()
    ipcProducts.communicate()

    // minimize, maximize and close buttons in index.html
    ipcMain.on('bar-message',(event, arg)=>{ 
        switch (arg) {
            case 1:
                mainWindow.minimize()
                break
            case 2: 
                x = (mainWindow.isMaximized()) ? mainWindow.unmaximize() : mainWindow.maximize()
                break
            case 3: 
                mainWindow.close()
        }
    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)
