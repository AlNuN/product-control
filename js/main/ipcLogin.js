const Nedb = require('nedb')
const { ipcMain } = require('electron')

// instantiate users database
let usersDB = new Nedb({
    filename: './databases/users',
    autoload: true
})

module.exports = {

    communicate: () =>{

        // receive user object from sign.signUp
        ipcMain.on('signUp-message', (event, arg) => {
            // test if login exists
            usersDB.findOne({login:arg.login}).exec((err, data) =>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        // if not found, insert it on users data base
                        usersDB.insert(arg, (err, data)=>{
                            if (err) {
                                console.log(`error: ${err}`)
                            } else {
                                console.log(data)
                            }
                        })
                        event.sender.send('signUp-reply', true )
                    } else {
                        event.sender.send('signUp-reply', false)
                    }
                }
            })
            // send reply 
        })

        // receive user object from sign.signIn
        ipcMain.on('signIn-message', (event, arg) => {
            // find it on users data base
            usersDB.findOne({login:arg.login, password:arg.password}).exec((err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        event.sender.send('signIn-reply', false )
                    } else {
                        event.reply('signIn-data', data )
                        event.sender.send('signIn-reply', true )
                    }
                }
            })
        })


    }
}