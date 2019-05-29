function loadReportTable (type) {
    if (type == 'Input') {
        ipcRenderer.send('loadReportTable-message', type)
    } else {
        ipcRenderer.send('loadReportTable-message', type)
    }
}

$('#reportInputs').on('click', () =>{
    $('#outputsLabel').removeClass('active')
    $('#inputsLabel').addClass('active')
    loadReportTable('Input')
})

$('#reportOutputs').on('click', () =>{
    $('#inputsLabel').removeClass('active')
    $('#outputsLabel').addClass('active')
    loadReportTable('Output')
})

$(()=>{
    if($('#reportTableDiv').html() == ''){
        loadReportTable('Input')
    }
})