const $ = require('jquery')
const {ipcRenderer} = require('electron')
const Users = require('../js/renderer/Users.js')
const { Products, Product} = require('../js/renderer/Products.js')
const sign = require('../js/renderer/sign.js')
const mainPage = require('../js/renderer/mainPage.js')

let products = new Products()
let product = new Product()
let loggedUser =  Users
let counter = 0

$(()=>{
    $("#root").load("../views/signIn.html")
})

function loadSignUp () {
    $("#root").load("../views/signUp.html")
}

// receive reply from ipcLogin And deals with registration events
ipcRenderer.on('signUp-reply', (event, arg) => {
    if(arg) {
        $("#root").load("../views/signIn.html")
    } else {
        $("#signUpFail").html('Login já existente')
    }
})

// recover logged user data
ipcRenderer.on('signIn-data', (event, arg) => {
    loggedUser.name = arg.name
    loggedUser.role = arg.role
    loggedUser.login = arg.login
    loggedUser.password = arg.password
})

// receive message from ipcLogin and deals with login events
ipcRenderer.on('signIn-reply', (event, arg) => {
    if (arg){
        $('#root').load("../views/mainBody.html")
    } else {
        $('#loginFail').html('Usuário e/ou senha incorreto(s)')
    }
})

ipcRenderer.on('addProducts-reply', (event, arg) => {
    if (arg){
        $('#addCode').val('')
        $('#addName').val('')
        $('#addLot').val('')
        $('#addValidity').val('') 
        $('#addUnit').val('') 
        $('#addAmount').val('')
        $('#addProductsSuccess').html("Produto inserido com sucesso!")
    } else {
        $('#addProductsFail').html('Já existe um produto com mesmo código')
    }
})

ipcRenderer.on('findProducts-reply', (event, arg)=>{
    $("#productsList").html('')
    let dropDownButton, addLotButton = ''
    arg.forEach( (val, idx, arr) => {
        dropDownButton = `<button class="btn btn-secondary btn-sm" onclick="loadProductLots(${val.code}, ${idx})"><i class="fas fa-angle-double-down"></i></button>`
        addLotButton = `<button class="btn btn-secondary btn-sm" onclick="addLot(${val.code}, ${idx})"><i class="fas fa-plus"></i></button>`
        $('#productsList').append(
            `<div class="row mt-1 border border-dark rounded align-items-center p-1">\
                <div class="col-sm-2">${val.code}</div>\
                <div class="col-sm-6">${val.name}</div>\
                <div class="col-sm-1 offset-2">${dropDownButton}</div>\
                <div class="col-sm-1">${addLotButton}</div>\
                <div class="container mt-2"><div class="row">\
                    <div class="col" id="variableContentDiv-${idx}"></div>\
                </div></div>\
            </div>`
            )
        })
})

ipcRenderer.on('findLots-reply', (event, arg, idx)=>{
    $(`#variableContentDiv-${idx}`).html('')
    $(`#variableContentDiv-${idx}`).append(
        `<div class="table-responsive">\
            <table class="table table-dark table-hover mt-1" id="innerTable-${idx}">\
                <thead>\
                    <tr>\
                        <th>Lote</th>\
                        <th>Validade</th>\
                        <th>Data</th>\
                        <th>Unidade</th>\
                        <th>Quantidade</th>\
                        <th>Usuário</th>\
                    </tr>\
                </thead>\
            </table>\
        </div>`
    )
    arg.forEach((val, index, arr) =>{
        $(`#innerTable-${idx}`).append(
            `<tbody>\
                <tr>\
                    <td>${val.lot}</td>\
                    <td>${val.validity}</td>\
                    <td>${val.date}</td>\
                    <td>${val.unit}</td>\
                    <td>${val.amount}</td>\
                    <td>${val.user}</td>\
                </tr>\
            <tbody>`
        )
    })
})

ipcRenderer.on('addLot-reply', (event, arg) => {
    if (arg){
        $('#addLotLot').val('')
        $('#addLotValidity').val('') 
        $('#addLotUnit').val('') 
        $('#addLotAmount').val('')
        $('#addLotSuccess').html("Lote inserido com sucesso!")
    } else {
        $('#addLotFail').html('Erro: o lote informado já está cadastrado')
    }
})

