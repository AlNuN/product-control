const {app, BrowserWindow, ipcMain} = require('electron')
const Nedb = require('nedb')

// keeping global reference of the variable, to avoid its garbage collection
let mainWindow

// instantiate users database
let usersDB = new Nedb({
    filename: './db/users', // collection name
    autoload: true
})


function createWindow() {
    mainWindow = new BrowserWindow({width:800, height:600, webPreferences: {nodeIntegration: true}})
    mainWindow.loadURL(`file://${__dirname}/../../views/index.html`)
    mainWindow.webContents.openDevTools()

    // receive message from index.html 
    ipcMain.on('asynchronous-message', (event, arg) => {
        // parse data into a JSON object
        let data = JSON.parse(arg)
        usersDB.insert(data, (err, data)=>{
            // insert it on users data base

            if (err) {
                console.log(`error: ${err}`)
            } else {
                console.log(data)
            }

        })
    
        // send message to index.html
        event.sender.send('asynchronous-reply', 'done' )

    })

    mainWindow.on('closed', () => {
        mainWindow = null
    })
}

app.on('ready', createWindow)