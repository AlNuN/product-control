// product related code
module.exports = {
    
    stock: () => {
        $('#mainPageStock').addClass('clicked')
        $('#mainPageReports').removeClass('clicked')
        $('#mainPageUserConfigs').removeClass('clicked')
        $('#main').load('../views/checkProducts.html')
    },
    
    reports: () => {
        $('#mainPageStock').removeClass('clicked')
        $('#mainPageReports').addClass('clicked')
        $('#mainPageUserConfigs').removeClass('clicked')
        $('#main').load('../views/reports.html')
    },
    
    userConfigs: () => {
        $('#mainPageStock').removeClass('clicked')
        $('#mainPageReports').removeClass('clicked')
        $('#mainPageUserConfigs').addClass('clicked')
        $('#main').load('../views/user.html')
    }
  
}