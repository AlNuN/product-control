const Nedb = require('nedb')
const { ipcMain } = require('electron')

// instantiate products database
let productsDB = new Nedb({
    filename: './databases/products',
    autoload: true
})

let productUsageDB = new Nedb({
    filename: './databases/productUsage',
    autoload: true
})

module.exports = {

    communicate: () =>{

        // receive user object from sign.signUp
        ipcMain.on('addProduct-message', (event, arg) => {
            // test if login exists
            console.log(arg)
            // productsDB.findOne({login:arg.login}).exec((err, data) =>{
            //     if (err) {
            //         console.log(`error: ${err}`)
            //     } else {
            //         if (data == null){
            //             // if not found, insert it on users data base
            //             usersDB.insert(arg, (err, data)=>{
            //                 if (err) {
            //                     console.log(`error: ${err}`)
            //                 } else {
            //                     console.log(data)
            //                 }
            //             })
            //             event.sender.send('reply', true )
            //         } else {
            //             event.sender.send('reply', false)
            //         }
            //     }
            // })
            // send reply 
        })

        // receive user object from sign.signIn
        ipcMain.on('message', (event, arg) => {
            // find it on users data base
            productsDB.findOne({login:arg.login, password:arg.password}).exec((err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        event.sender.send('reply', false )
                    } else {
                        event.sender.send('reply', true )
                    }
                }
            })
        })


    }
}
