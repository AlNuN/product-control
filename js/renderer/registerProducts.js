
$('#addProductsDb').on('click', () =>{
    products.code = $('#addCode').val()
    products.name = $('#addName').val()
    product.code = $('#addCode').val()
    product.lot = $('#addLot').val()
    product.validity = ($('#addValidity').val() + 'T00:00:00.000Z')
    product.date = new Date()
    product.unit = $('#addUnit').val() 
    product.amount = Number($('#addAmount').val())
    product.user = loggedUser.login

    ipcRenderer.send('addProducts-message', products, product )
})

