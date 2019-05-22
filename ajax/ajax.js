let $ = require('jquery')

window.onload = ()=>{
    $("#body").load("./views/signIn.html")
}

function removerProdutos() {
    $('#main').html('remover produtos')
}

function adicionarProdutos(){
    $('#main').html('adicionar produtos')
}
    
function cadastrarProdutos(){
    $('#main').html('cadastrar produtos')
}
    
function configuracoesUsuario(){
    $('#main').html('configurações de usuário')
}
  