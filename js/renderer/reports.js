let cleanForm

function loadReportTable (type) {

    let dirtyForm = $('form').serialize()
    let searchQuery = {}

    // compare if form has been modifyed
    if (cleanForm != dirtyForm){
        $('form').serializeArray().forEach((val, num, arr)=>{
            if(val.value != ""){
                if(val.name == "reportCode" ){
                    searchQuery.code = val.value

                } else if (val.name == "reportName"){
                    //implementar

                } else if (val.name == "reportLot"){
                    searchQuery.lot = val.value

                } else if (val.name == "reportUnit"){
                    searchQuery.unit = val.value

                } else if (val.name == "reportDateType"){
                    let start = $('#reportInitialDate').val()
                    let finish = $('#reportFinalDate').val()
                    if (start != "" && finish != "" ){
                        start = start + 'T00:00:00.000Z'
                        finish = finish + 'T00:00:00.000Z' 
                        switch (val.value){
                            case 'input': //Entrada 
                                if(type == 'Input'){
                                    searchQuery.date = {"$gte": start, "$lte": finish}
                                } else{
                                    searchQuery.inputDate = {"$gte": start, "$lte": finish}
                                }
                                break
                            case 'output': // Saída
                                if(type == 'Output'){searchQuery.date = {"$gte": start, "$lte": finish} }
                                break
                            case 'validity': // Validade
                                if(type == 'Input'){ searchQuery.date = {"$gte": start, "$lte": finish} }
                        }
                    }

                } else if (val.name == "reportAmount"){
                    searchQuery.amount = Number(val.value)

                } else if (val.name == "reportUser"){
                    searchQuery.user = val.value
                }
            }
        })
    }

    console.log(searchQuery)

    if (type == 'Input') {
        // validity: validade 3rd column
        //date: Data Entrada 4th column
        ipcRenderer.send('loadReportTable-message', type, searchQuery)
    } else {
        //inputDate: Data Entrada 3rd column
        // date: Data Saída 4th column
        ipcRenderer.send('loadReportTable-message', type, searchQuery)
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
    loadReportTable('Input')
})

$(()=>{
    if($('#reportTableDiv').html() == ''){
        cleanForm = $('form').serialize()
        loadReportTable('Input')
    }
})