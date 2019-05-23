const $ = require('jquery')
const {ipcRenderer} = require('electron')
const Users = require('../js/renderer/Users.js')
const sign = require('../js/renderer/sign.js')
const products = require('../js/renderer/products.js')

$(()=>{
    $("#root").load("../views/signIn.html")
})

function loadSignUp () {
    $("#root").load("../views/signUp.html")
}

// receive reply from ipcLogin
ipcRenderer.on('signUp-reply', (event, arg) => {
    if(arg) {
        $("#root").load("../views/signIn.html")
    } else {
        $("#signUpFail").html('Login já existente')
    }
})

// receive message from ipcLogin
ipcRenderer.on('signIn-reply', (event, arg) => {
    if (arg){
        $('#root').load("../views/mainBody.html")
    } else {
        $('#loginFail').html('Usuário e/ou senha incorreto(s)')
    }
})