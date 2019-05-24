const $ = require('jquery')
const {ipcRenderer} = require('electron')
const Users = require('../js/renderer/Users.js')
const Products = require('../js/renderer/Products.js')
const sign = require('../js/renderer/sign.js')
const mainPage = require('../js/renderer/mainPage.js')

let product = Products
let loggedUser =  Users

$(()=>{
    $("#root").load("../views/signIn.html")
})

function loadSignUp () {
    $("#root").load("../views/signUp.html")
}

// receive reply from ipcLogin And deals with register events
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
