const Nedb = require('nedb')
const { ipcMain } = require('electron')

// instantiate products databases

let productsDB = new Nedb({
    filename: './databases/products',
    autoload: true
})

let productInputDB = new Nedb({
    filename: './databases/productInput',
    autoload: true
})

let productStockDB = new Nedb({
    filename: './databases/productStock',
    autoload: true
})

let productOutputDB = new Nedb({
    filename: './databases/productUsage',
    autoload: true
})

module.exports = {

    communicate: () =>{

        // receive user object from sign.signUp
        ipcMain.on('addProducts-message', (event, arg1, arg2) => {
            arg2.date = new Date(arg2.date)
            arg2.validity = new Date(arg2.validity)
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
                        // and in product databases
                        productInputDB.insert(arg2, (err, data)=>{
                            if (err) {
                                console.log(`error: ${err}`)
                            } else {
                                console.log(data, 'input')
                            }
                        })

                        productStockDB.insert(arg2, (err, data)=>{
                            if (err) {
                                console.log(`error: ${err}`)
                            } else {
                                console.log(data, 'stock')
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
            productStockDB.find({"code":arg.toString()}, (err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        console.log('não há lotes no banco de dados!')
                    } else {
                        event.sender.send('findLots-reply', data, idx)
                    }
                }
            })
        })

        ipcMain.on('addLot-message', (event, arg) => {
            arg.date = new Date(arg.date)
            arg.validity = new Date(arg.validity)
            // find it on product data base
            productStockDB.insert(arg, (err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    console.log(data, 'stock')
                }
            })

            productInputDB.insert(arg, (err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    console.log(data,  'input')
                }
            })
            event.sender.send('addLot-reply', true )
        })

        ipcMain.on('output-message', (event, id, value, newValue, index, user, unit, inputDate, code, lot) =>{
            productStockDB.findOne({"_id":id}).exec((failure, editObj) =>{
                if(failure){
                    console.log(`error: ${failure}`)
                } else{
                    value = Number(value)
                    newValue = Number(newValue)
                    let removal = (value - newValue)
                    let outputObj = {"date": new Date(), "unit":unit, "amount":removal, "user":user, "inputDate": new Date(inputDate), "code":code, "lot":lot}
                    if(editObj.amount == value){
                        if(newValue < editObj.amount){
                            if(newValue == 0){
                                // If new value = 0, remove from stock, save output and prepare feedback
                                productStockDB.remove({"_id":id}, {}, (err, numRemoved)=>{
                                    if(err){
                                        console.log(`erro: ${err}`)
                                    } else {
                                        console.log(`removed: ${numRemoved} from productStockDB`)
                                    }
                                })
                                productOutputDB.insert(outputObj, (err, data)=> {
                                    if (err) {
                                        console.log(`error: ${err}`)
                                    } else {
                                        console.log(data)
                                    }
                                })
                                event.sender.send('output-reply', true, index, newValue)

                            } else {
                                // If 0 < newValue < data.amount update stock, save output, prepare feedback
                                productStockDB.update({"_id":id}, {$set:{"amount":newValue}}, {}, (err, numReplaced)=>{
                                    if(err){
                                        console.log(`erro: ${err}`)
                                    } else {
                                        console.log(`update, replaced: ${numReplaced}`)
                                    }
                                })
                                productOutputDB.insert(outputObj, (err, data)=>{
                                    if (err) {
                                        console.log(`error: ${err}`)
                                    } else {
                                        console.log(data)
                                    }
                                })
                                event.sender.send('output-reply', true, index, newValue)

                            } 
                        } else {
                            // If newValue = data.amount, there is nothing to change
                            console.log(`por favor especifique um valor menor que ${value}`)
                            event.sender.send('output-reply', false, index, newValue)
                        }
                        
                    } else {
                        // if data.amount != value there is a data inconsistency from db, the program etc
                        console.log('inconsistência de dados!')
                        event.sender.send('output-reply', false, index, newValue)
                    } 
                }

            })
        })


        ipcMain.on('loadReportTable-message', (event, arg) => {
            // find it on product data base
            if(arg == 'Input'){
                productInputDB.find({}, (err, data)=>{
                    if (err) {
                        console.log(`error: ${err}`)
                    } else {
                        if (data == null){
                            event.sender.send('loadReportTable-reply', data, arg, false)
                        } else {
                            event.sender.send('loadReportTable-reply', data, arg, true)
                        }
                    }
                })
            } else {
                    productOutputDB.find({}, (err, data)=>{
                        if (err) {
                            console.log(`error: ${err}`)
                        } else {
                            if (data == null){
                                event.sender.send('loadReportTable-reply', data, arg, false)
                            } else {
                                event.sender.send('loadReportTable-reply', data, arg, true)
                            }
                        }
                    })
            }
        })

    }

}
