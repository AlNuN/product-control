function loadReportTable (type) {
    if (type == 'Input') {
        ipcRenderer.send('loadReportTable-message', type)
    } else {
        ipcRenderer.send('loadReportTable-message', type)
    }
    // $(`#reportTableDiv`).html('')
    // $(`#reportTableDiv`).append(
    //     `<div id="ldrt" class="ldrt"></div>
    //     <div class="table-responsive">
    //     <table class="table table-dark table-hover mt-1">
    //     <thead>
    //     <tr>
    //     <th>Lote</th>
    //     <th>Validade</th>
    //     <th>Data</th>
    //     <th>Unidade</th>
    //     <th>Quantidade</th>
    //     <th>Usuário</th>
    //     <th>Opções</th>
    //     </tr>
    //     </thead>
    //     <tbody id="innerReportTable">
    //     <tbody>
    //     </table>
    //     </div>`
    //     )
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