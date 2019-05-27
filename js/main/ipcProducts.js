const Nedb = require('nedb')
const { ipcMain } = require('electron')

// instantiate products database
let productsDB = new Nedb({
    filename: './databases/products',
    autoload: true
})

let productDB = new Nedb({
    filename: './databases/product',
    autoload: true
})

let productUsageDB = new Nedb({
    filename: './databases/productUsage',
    autoload: true
})

module.exports = {

    communicate: () =>{

        // receive user object from sign.signUp
        ipcMain.on('addProducts-message', (event, arg1, arg2) => {
            // test if products exists
            productsDB.findOne({code:arg1.code}).exec((err, data) =>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        // if not found, insert it on procts database
                        productsDB.insert(arg1, (err, data)=>{
                            if (err) {
                                console.log(`error: ${err}`)
                            } else {
                                console.log(data)
                            }
                        })
                        // and in product database
                        productDB.insert(arg2, (err, data)=>{
                            if (err) {
                                console.log(`error: ${err}`)
                            } else {
                                console.log(data)
                            }
                        })
                        event.sender.send('addProducts-reply', true )
                    } else {
                        event.sender.send('addProducts-reply', false)
                    }
                }
            })
        })

        // receive products query
        ipcMain.on('findProducts-message', (event, arg) => {
            // find it on products data base
            productsDB.find(arg).exec((err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        console.log('não há produtos no banco de dados!')
                    } else {
                        event.sender.send('findProducts-reply', data )
                    }
                }
            })
        })

        // receive product query
        ipcMain.on('findLots-message', (event, arg, idx) => {
            // find it on product data base
            productDB.find({"code":arg.toString()}, (err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        console.log('não há produtos no banco de dados!')
                    } else {
                        event.sender.send('findLots-reply', data, idx)
                    }
                }
            })
        })

        ipcMain.on('addLot-message', (event, arg) => {
            // find it on product data base
            productDB.findOne({code:arg.lot}).exec((err, data) =>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        // if not found, insert it on proct database
                        productDB.insert(arg, (err, data)=>{
                            if (err) {
                                console.log(`error: ${err}`)
                            } else {
                                console.log(data)
                            }
                        })
                        event.sender.send('addLot-reply', true )
                    } else {
                        event.sender.send('addLot-reply', false)
                    }
                }
            })
        })

    }
}
