const eventRemoveButtonListener = () =>{
  $('main').on('click', '.event-remove-button', function(event){
    event.preventDefault()
    //Place Holder for actual id in state
    let id = 15
    openRemoveConfirm(id)
  })
}

const openRemoveConfirm = (id) =>{
  // This will probably be a modal window so we might not need to hide stuff
  hideAll()
  $('#remove').removeAttr('hidden')
}

const removeConfirmButtonListener = () =>{
  $('#confirm-delete-button').click(function(event){
    event.preventDefault()
    deleteEvent()
    openDashboard()
  })
}

const deleteEvent = () =>{
  // Make a DELETE request to the server
  console.log('DELETE EVENT')
}

const removeCancleButtonListener = () =>{
  $('#cancel-delete-button').click(function(event){
    event.preventDefault()
    openDashboard()
  })
}

const manageRemoveConfirm = () => {
  eventRemoveButtonListener()
  removeCancleButtonListener()
  removeConfirmButtonListener()
}