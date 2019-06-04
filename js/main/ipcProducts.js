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
        ipcMain.on('addProducts-message', (event, arg) => {
            let msg
            // test if products exists
            if (arg.code != '' && arg.name != ''){
                productsDB.findOne({code:arg.code}).exec((err, data) =>{
                    if (err) {
                        console.log(`error: ${err}`)
                    } else {
                        if (data == null){
                            // if not found, insert it on procts database
                            productsDB.insert(arg, (err, data)=>{
                                if (err) {
                                    console.log(`error: ${err}`)
                                } else {
                                    console.log(data)
                                }
                            })
                            msg = 'Produto inserido com sucesso!'
                            event.sender.send('addProducts-reply', true, msg )
                        } else {
                            msg = 'Já existe um produto com mesmo código'
                            event.sender.send('addProducts-reply', false, msg)
                        }
                    }
                })
            } else {
                msg = 'Ambos os campos devem ser preenchidos'
                event.sender.send('addProducts-reply', false, msg)
            }

        })

        // receive products query
        ipcMain.on('findProducts-message', (event, arg) => {
            // find it on products data base
            if(arg.name){ arg.name = new RegExp(arg.name, 'i') }
            productsDB.find(arg).exec((err, data)=>{
                if (err) {
                    console.log(`error: ${err}`)
                } else {
                    if (data == null){
                        console.log('não há produtos no banco de dados!')
                    } else {
                        if(arg.name){ arg.name = new RegExp(arg.name, 'i') }
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
            arg.validity = (arg.validity != 'T00:00:00.000Z') ? new Date(arg.validity) : ''

            if(arg.amount == 0 || arg.lot == ''){
                event.sender.send('addLot-reply', false )
            } else {
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
            }
        })

        ipcMain.on('output-message', (event, id, value, newValue, index, user, unit, inputDate, code, lot, destination) =>{
            productStockDB.findOne({"_id":id}).exec((failure, editObj) =>{
                if(failure){
                    console.log(failure)
                } else{
                    value = Number(value)
                    newValue = Number(newValue)
                    let removal = (value - newValue)
                    let outputObj = {"date": new Date(), "unit":unit, "amount":removal, "user":user, "inputDate": new Date(inputDate), "code":code, "lot":lot, "destination":destination}
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
                                        console.log(`updated: ${numReplaced} in productStockDB`)
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


        // seaches for the report table and for the page search
        ipcMain.on('loadReportTable-message', (event, type, searchQuery, dateType, gte, lte) => {
            let name

            // date query for Date objects
            if (gte != null && lte != null){
                gte = new Date(gte)
                lte = new Date(lte)
                switch (dateType){
                    case 'input': //Entrada 
                        if(type == 'Input'){
                            searchQuery.date = {"$gte": gte, "$lte": lte}
                        } else{
                            searchQuery.inputDate = {"$gte": gte, "$lte": lte}
                        }
                        break
                    case 'output': // Saída
                        if(type == 'Output'){
                            searchQuery.date = {"$gte": gte, "$lte": lte}
                        } else {
                            searchQuery.nothing = 'x'
                        }
                        break
                    case 'validity': // Validade
                        if(type == 'Input'){ 
                            searchQuery.validity = {"$gte": gte, "$lte": lte}
                        } else {
                            searchQuery.nothing = 'x'
                        }
                }
            }
            
            productsDB.find({}, {'_id': 0}, (error, result)=>{
                if(error){
                    console.log(`error: ${error}`)
                } else {
                    name = result
                }
            })

            // database operations  
            if(type == 'Input'){
                productInputDB.find(searchQuery, (err, data)=>{
                    if (err) {
                        console.log(`error: ${err}`)
                    } else {
                        if (data.length == 0){
                            event.sender.send('loadReportTable-reply', data, type, false, name)
                        } else {
                            event.sender.send('loadReportTable-reply', data, type, true, name)
                        }
                    }
                })
            } else {
                    productOutputDB.find(searchQuery, (err, data)=>{
                        if (err) {
                            console.log(`error: ${err}`)
                        } else {
                            if (data.length == 0){
                                event.sender.send('loadReportTable-reply', data, type, false, name)
                            } else {
                                event.sender.send('loadReportTable-reply', data, type, true, name)
                            }
                        }
                    })
            }
        })

        ipcMain.on('removeLot-message', (event, id, index, lot, date, test) =>{
            productOutputDB.findOne({"lot": lot}).exec((error, result)=>{
                if (result == null){
                    date = new Date(date)
                    productInputDB.remove({"lot": lot, "date": date}, {}, (err, numRemoved)=>{
                        if (err){
                            console.log(err)
                        } else{
                            console.log('removed ',numRemoved, ' from InputDB')
                        }
                    })
                    productStockDB.remove({"lot": lot, "date": date}, {}, (err, numRemoved)=>{
                        if (err){
                            console.log(err)
                        } else{
                            console.log('removed ', numRemoved, ' from StockDB')
                        }
                    })
                    event.sender.send('removeLot-reply', true, index, 'Lote removido com sucesso')
                } else{
                    event.sender.send('removeLot-reply', false, index, 'Impossível remover, pois já houve saída do produto')
                }
            })
        })

    }
}
