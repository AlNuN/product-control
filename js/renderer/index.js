const $ = require('jquery')
const {ipcRenderer} = require('electron')
const Users = require('../js/renderer/Users.js')
const { Products, Product } = require('../js/renderer/Products.js')
const sign = require('../js/renderer/sign.js')
const mainPage = require('../js/renderer/mainPage.js')

let products = new Products()
let product = new Product()
let loggedUser =  Users
let cleanForm

// page that loads after DOM loading
$(()=>{
    $("#root").load("../views/signIn.html")
})


function loadSignUp () {
    $("#root").load("../views/signUp.html")
}


// Turn a ISO date string in a dd/mm/yyyy string
function presentDate (date) {
    if (date == null || date == '' || date == undefined) { return ''}
    date = date.split('T')[0]
    date = date.split('-')
    return date[2] + '/' + date[1] + '/' + date[0]
}


// sort a column n of a table with a id = tbId. It sorts number, string and date in presentDate format
function tableSort(n, tbId){
    let tabela, linhas, trocando, i, x, y, deveriaTrocar,
        dir, eNumero, contadorTrocas = 0
    tabela = document.getElementById(tbId)
    trocando = true;
    dir = "asc"
    while (trocando){
        trocando = false
        linhas = tabela.rows
        for (i = 1; i < (linhas.length - 1); i++){
            deveriaTrocar = false
            x = linhas[i].getElementsByTagName("td")[n].innerHTML
            y = linhas[i + 1].getElementsByTagName("td")[n].innerHTML
            eNumero = isNumeric(x)
            if(eNumero == false){
                x = x.toLowerCase()
                y = y.toLowerCase()
            } else if (eNumero == -1){
                x = Number(convertDate(x))
                y = Number(convertDate(y))
            } else{
                x = Number(x)
                y = Number(y)
            }
            if (dir == "asc") {
                if (x > y) {
                    deveriaTrocar = true
                    break
                }
            } else if (dir == "desc") {
                if (x < y){
                    deveriaTrocar = true
                    break
                    }
            }
        }
        if (deveriaTrocar){
            linhas[i].parentNode.insertBefore(linhas[i + 1], linhas[i])
            trocando = true
            contadorTrocas ++
        } else {
            if (contadorTrocas == 0 && dir == "asc"){
                dir = "desc"
                trocando = true
            }
        }
    }
}


// test if the td content is number, string or date for the tableSort function
function isNumeric(n){
    if((/\d+\/\d+\/\d\d\d\d/).test(n)) { return -1 }
    return !isNaN(parseFloat(n)) && isFinite(n)
}


// convert date into number for sorting
function convertDate(d){
    let p = d.split("/")
    return +(p[2]+p[1]+p[0])
}


ipcRenderer.on('signUp-reply', (event, arg, msg) => {
    if(arg) {
        $("#root").load("../views/signIn.html")
    } else {
        $("#signUpFail").html(msg)
    }
})

// recover logged user data
ipcRenderer.on('signIn-data', (event, arg) => {
    loggedUser.name = arg.name
    loggedUser.role = arg.role
    loggedUser.login = arg.login
    loggedUser.password = arg.password
    loggedUser._id = arg._id
})

// receive message from ipcLogin and deals with login events
ipcRenderer.on('signIn-reply', (event, arg) => {
    if (arg){
        $('#root').load("../views/mainBody.html")
    } else {
        $('#loginFail').html('Usuário e/ou senha incorreto')
    }
})

ipcRenderer.on('changePassword-reply', (event, arg) => {
    if (arg){
        $('#passwordChangeInfo').html("Senha modificada com sucesso")
    } else {
        $('#passwordChangeInfo').html('Senha incorreta!')
    }
})

ipcRenderer.on('addProducts-reply', (event, arg, msg) => {
    if (arg){
        $('#checkCode').val('')
        $('#checkName').val('')
        $('#addProductsFail').html('')
        $('#addProductsSuccess').html(msg)
        loadProducts()
    } else {
        $('#addProductsSuccess').html('')
        $('#addProductsFail').html(msg)
    }
})

// response to loadProducts function on checkProducts
ipcRenderer.on('findProducts-reply', (event, arg)=>{
    $("#productsList").html('')
    let dropDownButton, addLotButton = ''
    arg.forEach( (val, idx, arr) => {
        dropDownButton = `<button class="btn btn-secondary btn-sm" onclick="loadProductLots(${val.code}, ${idx})" title="Mostrar Lotes"><i class="fas fa-angle-double-down"></i></button>`
        addLotButton = `<button class="btn btn-secondary btn-sm" onclick="addLot(${val.code}, ${idx})" title="Adicionar Lote"><i class="fas fa-plus"></i></button>`
        $('#productsList').append(
            `<div class="row mt-1 pt-2 rounded align-items-center text-light bg-dark">
                <div class="col-sm-2">${val.code}</div>
                <div class="col-sm-6">${val.name}</div>
                <div class="col-sm-1 offset-2">${dropDownButton}</div>
                <div class="col-sm-1">${addLotButton}</div>
                <div class="container mt-2">
                <div class="row">
                    <div class="col" id="variableContentDiv-${idx}"></div>
                </div></div>
            </div>`
            )
        })
})


// response to function loadProductLots from checkProducts
ipcRenderer.on('findLots-reply', (event, hasData, arg, idx)=>{
    if($('#ldt').hasClass('ldt')){
        $(`#variableContentDiv-${idx}`).html('')
    } else{
        if (hasData) {
            $(`#variableContentDiv-${idx}`).html('')
            $(`#variableContentDiv-${idx}`).append(
                `<div id="ldt" class="ldt"></div>
                <div class="table-responsive">
                <table class="table table-dark table-hover mt-1" id="stockTable">
                <thead>
                <tr>
                <th onclick="tableSort(0, 'stockTable')">
                    <div class="d-flex justify-content-between align-items-center"><span>Lote</span><i class="fas fa-sort"></i></div>
                </th>
                <th onclick="tableSort(1, 'stockTable')">
                    <div class="d-flex justify-content-between align-items-center"><span>Validade</span><i class="fas fa-sort"></i></div>
                </th>
                <th onclick="tableSort(2, 'stockTable')">
                    <div class="d-flex justify-content-between align-items-center"><span>Data</span><i class="fas fa-sort"></i></div>
                </th>
                <th onclick="tableSort(3, 'stockTable')">
                    <div class="d-flex justify-content-between align-items-center"><span>Unidade</span><i class="fas fa-sort"></i></div>
                </th>
                <th onclick="tableSort(4, 'stockTable')">
                    <div class="d-flex justify-content-between align-items-center"><span>Quantidade</span><i class="fas fa-sort"></i></div>
                </th>
                <th onclick="tableSort(5, 'stockTable')">
                    <div class="d-flex justify-content-between align-items-center"><span>Usuário</span><i class="fas fa-sort"></i></div>
                </th>
                <th>Opções</th>
                </tr>
                </thead>
                <tbody id="innerTable-${idx}">
                <tbody>
                </table>
                </div>`
                )
                
                let outputButton, deleteButton = ''
                
                arg.forEach((val, index, arr) =>{
                    outputButton = `<button type="button" class="btn btn-warning btn-sm m-1" title="Retirar produtos deste lote"
                    onclick="output('${val._id}', ${index}, '${val.unit}', '${val.date}', '${val.code}', '${val.lot}')">
                    <i class="fas fa-box-open"></i></button>`
                    deleteButton = `<button class="btn btn-danger btn-sm m-1"  title="Remover registro (Corrigir erro, somente)"
                    onclick="removeLot('${val._id}', ${index}, '${val.lot}', '${val.date}')">
                    <i class="fas fa-times"></i></button>`
                    $(`#innerTable-${idx}`).append(
                        `
                        <tr>
                            <td>${val.lot}</td>
                            <td>${presentDate(val.validity)}</td>
                            <td>${presentDate(val.date)}</td>
                            <td>${val.unit}</td>
                            <td id="tableData-${index}">${val.amount}</td>
                            <td>${val.user}</td>
                            <td><div class="d-flex justify-content-around">${outputButton}${deleteButton}</div></td>
                        </tr>
                    `
                )
            })
        } else {
            $(`#variableContentDiv-${idx}`).html(`<div id="ldt" class="ldt"></div><p class="text-danger">Ainda não há lotes cadastrados para este produto</p>`)
        }
    }
})

// response to function addLot on checkProducts.js
ipcRenderer.on('addLot-reply', (event, arg) => {
    if (arg){
        $('#addLotLot').val('')
        $('#addLotValidity').val('') 
        $('#addLotUnit').val('') 
        $('#addLotAmount').val('')
        $('#addLotFail').html('')
        $('#addLotSuccess').html("Lote inserido com sucesso!")
    } else {
        $('#addLotSuccess').html('')
        $('#addLotFail').html('Favor preencher os campos obrigatórios')
    }
})

// response to function output on checkProducts.js
ipcRenderer.on('output-reply', (event, arg, index, newValue, msg) => {
    if (arg){
        $(`#tableData-${index}`).html(`${newValue}`)
    } else {
        $('#outputFail').html(msg)
    }
})

// load report tables in response to function LoadReportTable in report.js
ipcRenderer.on('loadReportTable-reply', (event, data, inOrOut, hasData, name)=>{
    let entradaOuSaida, valInpDate, amoRem, dataValInp, inOutdate, tdName, destinationTh, destinationTd = null
    if (inOrOut == 'Input') {
        entradaOuSaida = 'entrada'
        valInpDate = 'Validade'
        amoRem = 'Quantidade'
        inOutdate = 'Data Entrada'
        destinationTh = ''
    } else {
        entradaOuSaida = 'saída'
        valInpDate = 'Data Entrada'
        amoRem = 'Qdte Removida'
        inOutdate = 'Data Saída'
        destinationTh = `
            <th onclick="tableSort(8, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>Destino</span><i class="fas fa-sort"></i></div>
            </th>
        ` 
    }

    if(hasData){
        $(`#reportTableDiv`).html('')
        $(`#reportTableDiv`).append( `
            <div class="table-responsive">
            <table class="table table-dark table-hover mt-1" id="reportTable">
            <thead>
            <tr>
            <th onclick="tableSort(0, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>Produto</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(1, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>Código</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(2, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>Lote</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(3, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>${valInpDate}</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(4, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>${inOutdate}</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(5, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>Unidade</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(6, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>${amoRem}</span><i class="fas fa-sort"></i></div>
            </th>
            <th onclick="tableSort(7, 'reportTable')">
                <div class="d-flex justify-content-between align-items-center"><span>Usuário</span><i class="fas fa-sort"></i></div>
            </th>
            ${destinationTh}
            </tr>
            </thead>
            <tbody id="innerReportTable">
            <tbody>
            </table>
            </div>
        `)

        data.forEach(val =>{
            name.forEach(value=>{if (value.code == val.code){tdName = value.name}})
            dataValInp = (inOrOut == 'Input') ? val.validity : val.inputDate
            destinationTd = (inOrOut == 'Input') ? '' : `<td>${val.destination}</td>`
            $(`#innerReportTable`).append(`
                <tr>
                    <td>${tdName}</td>
                    <td>${val.code}</td>
                    <td>${val.lot}</td>
                    <td>${presentDate(dataValInp)}</td>
                    <td>${presentDate(val.date)}</td>
                    <td>${val.unit}</td>
                    <td>${val.amount}</td>
                    <td>${val.user}</td>
                    ${destinationTd}
                </tr>
            `)
        })

    }else {
        $('#reportTableDiv').html(`<p class="text-danger">Não há dados de <strong>${entradaOuSaida}</strong> para a pesquisa realizada</p>`)
    }
})

ipcRenderer.on('removeLot-reply', (event, success, index, msg)=>{
    if (success) {
        $(`#tableData-${index}`).html('--')
    } else {
        $('#removeMsg').html(msg)
    }
})

$('#minimizeButton').on('click', () => {
    ipcRenderer.send('bar-message', true)
})

$('#closeButton').on('click', () => {
    ipcRenderer.send('bar-message', false)
})

ipcRenderer.on('removeUser-reply', (event, msg)=>{
    $('#root').load("../views/signIn.html")
})

