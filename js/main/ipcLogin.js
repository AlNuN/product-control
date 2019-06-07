const Nedb = require('nedb')
const { ipcMain } = require('electron')
const md5 = require('md5')

// instantiate users database
let usersDB = new Nedb({
    filename: './databases/users',
    autoload: true
})

module.exports = {

    communicate: () =>{

        // receive user object from sign.signUp
        ipcMain.on('signUp-message', (event, arg) => {
            if (arg.login == '' || arg.name == '' || arg.role == '' || arg.password == ''){
                event.sender.send('signUp-reply', false, 'Todos os campos são obrigatórios')
            } else {
                // test if login exists
                usersDB.findOne({login:arg.login}).exec((err, data) =>{
                    if (err) {
                        console.log(`error: ${err}`)
                    } else {
                        if (data == null){
                            arg.password = md5(arg.password)
                            // if not found, insert it on users data base
                            usersDB.insert(arg, (err, data)=>{
                                if (err) {
                                    console.log(`error: ${err}`)
                                } else {
                                    console.log(data)
                                }
                            })
                            event.sender.send('signUp-reply', true, '' )
                        } else {
                            event.sender.send('signUp-reply', false, 'Login já existente')
                        }
                    }
                })
            }
        })

        // receive user object from sign.signIn
        ipcMain.on('signIn-message', (event, arg) => {
            // find it on users data base
            arg.password = md5(arg.password)
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
        
        ipcMain.on('changePassword-message', (event, oldPassword, newPassword, login)=>{
            oldPassword = md5(oldPassword)
            newPassword = md5(newPassword)
            usersDB.findOne({"login":login, "password":oldPassword}).exec((err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        event.sender.send('changePassword-reply', false )
                    } else {
                        usersDB.update({"_id": data._id}, {"$set":{"password": newPassword}}, {}, (error, numModificados)=>{
                            if (error) {
                                console.log(error)
                            } else {
                                event.sender.send('changePassword-reply', true )
                            }

                        })
                    }
                }
            })
            
        })

        ipcMain.on('removeUser-message', (event, userId) =>{
            usersDB.remove({"_id": userId}, {}, (err, numRemoved)=>{
                if (err){
                    console.log(err)
                } else{
                    console.log(numRemoved)
                    event.sender.send('removeUser-reply', 'Usuário removido com sucesso')
                }
            })
        })


    }
}