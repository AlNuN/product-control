const {app, BrowserWindow, ipcMain} = require('electron')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow


function createWindow() {
    mainWindow = new BrowserWindow({width:800, height:600, webPreferences: {nodeIntegration: true}})
    mainWindow.loadURL(`file://${__dirname}/index.html`)
    mainWindow.webContents.openDevTools()

    // receive message from index.html 
    ipcMain.on('asynchronous-message', (event, arg) => {
        console.log( arg )
    
        // send message to index.html
        event.sender.send('asynchronous-reply', 'done' )

    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)