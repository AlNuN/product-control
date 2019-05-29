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
        $('#main').load('../views/checkProducts.html')
    },

    reports: () => {
        $('#main').load('../views/reports.html')
    },
        
    userConfigs: () => {
        $('#main').html('configurações de usuário')
    }
  
}