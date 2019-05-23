module.exports = {

    loadSignUp: () => {
        $("#root").load("../views/signUp.html")
    },

    removerProdutos: ()  => {
        $('#main').html('remover produtos')
    },

    adicionarProdutos: () => {
        $('#main').html('adicionar produtos')
    },
        
    cadastrarProdutos: () => {
        $('#main').html('cadastrar produtos')
    },
        
    configuracoesUsuario: () => {
        $('#main').html('configurações de usuário')
    }
  
}