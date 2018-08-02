const openDashboard = () => {
  hideAll()
  console.log('GET all events for this user')
  // Make a request to the server for dashboard info
  $('#dash').removeAttr('hidden')
}

const openLiveForm = (id) =>{
  // use the id to pick the correct URL
  console.log('GET the feedback code for the specific form')
  window.open('./feedback.html', '_blank')
}

const eventInfoLinkListener = () => {
  $('#dash').find('.js-event-info-link').on('click', function(event){
    event.preventDefault()
    // Need some what to store the data so we can make the correct API request based upon the link for now we'll leave a place holder
    let id = 15
    openEventInfo(id)
  })
}

const eventLiveFormLinkListener = () =>{
  $('main').find('.live-form-link').on('click', function(event){
    event.preventDefault()
    // Placeholder for actual id in state
    let id = 15
    openLiveForm(id)
  })
}

const manageDashboard = () => {
  eventInfoLinkListener()
  eventLiveFormLinkListener()
}