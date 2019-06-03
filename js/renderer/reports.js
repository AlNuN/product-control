function loadReportTable (type) {

    let dirtyForm = $('form').serialize()
    let searchQuery = {}
    let gte, lte, dateType


    // compare if form has been modifyed
    if (cleanForm != dirtyForm){
        $('form').serializeArray().forEach((val, num, arr)=>{
            if(val.value != ""){
                if(val.name == "reportCode" ){
                    searchQuery.code = val.value

                } else if (val.name == "reportLot"){
                    searchQuery.lot = val.value

                } else if (val.name == "reportUnit"){
                    searchQuery.unit = val.value

                } else if (val.name == "reportDateType"){
                    // the date query is made in main process because it has to be Date object
                    let start = $('#reportInitialDate').val()
                    let finish = $('#reportFinalDate').val()
                    if (start != "" && finish != "" ){
                        gte = start + 'T00:00:00.000Z'
                        lte = finish + 'T23:59:59.999Z' 
                        dateType = val.value
                    }

                } else if (val.name == "reportAmount"){
                    searchQuery.amount = Number(val.value)

                } else if (val.name == "reportUser"){
                    searchQuery.user = val.value
                }
            }
        })
    }


    if (type == 'Input') {
        // validity: validade 3rd column
        //date: Data Entrada 4th column
        ipcRenderer.send('loadReportTable-message', type, searchQuery, dateType, gte, lte)
    } else {
        //inputDate: Data Entrada 3rd column
        // date: Data Saída 4th column
        ipcRenderer.send('loadReportTable-message', type, searchQuery, dateType, gte, lte)
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

// clear all fields and reload
$('#clearReportFields').on('click', ()=>{
    $('#reportCode').val("")
    $('#reportName').val("")
    $('#reportLot').val("")
    $('#reportUnit').val("")
    $('#reportDateType').val("")
    $('#reportInitialDate').val("")
    $('#reportFinalDate').val("")
    $('#reportAmount').val("")
    $('#reportUser').val("")
    $('#outputsLabel').removeClass('active')
    $('#inputsLabel').addClass('active')
    loadReportTable('Input')
})

$(()=>{
    if($('#reportTableDiv').html() == ''){
        cleanForm = $('form').serialize()
        loadReportTable('Input')
    }
})