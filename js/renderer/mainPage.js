// product related code
module.exports = {
    
    registerProducts: ()  => {
        $.ajax ({
            async: true,
            url: '../views/registerProducts.html',
            context: document.body
        }).done(data =>{
            $('#main').html(data)
        })
    },

    chart: () => {
        $('#main').html('tabela')
    },

    reports: () => {
        $('#main').html('relatórios')
    },
        
    userConfigs: () => {
        $('#main').html('configurações de usuário')
    }
  
}