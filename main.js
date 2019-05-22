const {app, BrowserWindow} = require('electron')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow


function createWindow() {
    mainWindow = new BrowserWindow({width:800, height:600, webSecurity:false})
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)