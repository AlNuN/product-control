let $ = require('jquery')
let Users = require('../js/classes/Users.js')
let sign = require('../js/renderer/sign.js')
let products = require('../js/renderer/products.js')

$(()=>{
    $("#root").load("../views/signIn.html")
})

function loadSignUp () {
    $("#root").load("../views/signUp.html")
}
