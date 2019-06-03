// product related code
module.exports = {
    
    stock: () => {
        $('#main').load('../views/checkProducts.html')
    },

    reports: () => {
        $('#main').load('../views/reports.html')
    },
        
    userConfigs: () => {
        $('#main').load('../views/user.html')
    }
  
}