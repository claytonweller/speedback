const clearEventEditorFields = () => $('#edit').find('input, textarea').val('')

const createEvent = () =>{
  //Will create a POST a new, blank event in the database and upon a successful return, it will open the event editor with the default values.
  openEventEditor()
  console.log('POST new event')
}

const openEventEditor = () =>{
  console.log('GET selected event')
  hideAll()
  $('#edit').removeAttr('hidden')
}

const submitEventEdits = () =>{
  
  let endDate = $('#edit-date').val()
  let endTime = $('#edit-time').val()

  let eventInfo = {
    title: $('#edit-title').val(),
    host: $('#edit-host').val(),
    endTimeStamp: new Date(endDate+'T'+endTime).getTime() / 1000,
    thanks: $('#edit-thanks').val()
  }

  console.log('PUT event update', eventInfo)
}


//Listeners

const eventEditButtonListener = () =>{
  $('main').on('click', '.event-edit-button', function(event){
    event.preventDefault()
    //Populate the event editor with appropriate info
    openEventEditor()
  })
}

const eventEditorCancelButtonListener = () =>{
  $('#edit-cancel-button').click(function(event){
    event.preventDefault()
    // If it's a brand new event it should delete the event as well
    if('new'){
      deleteEvent()
      openDashboard()
    } else {
      openEventInfo()
    }
    clearEventEditorFields()
    
  })
}

const eventEditorSubmitButtonListener = () =>{
  $('#edit-submit-button').click(function(event){
    event.preventDefault()
    submitEventEdits()
    openEventInfo()
    clearEventEditorFields()
    //Maybe put in a thing that opens the live form in another tab?
  })
}

const newEventButtonListener = () => {
  $('.js-new-event-button').click(function(event){
    event.preventDefault()
    createEvent()
  })
}

const manageEventEditor = () =>{
  newEventButtonListener()
  eventEditButtonListener()
  eventEditorSubmitButtonListener()
  eventEditorCancelButtonListener()  
}

