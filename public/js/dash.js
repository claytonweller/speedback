// DASHBOARD STUFF

const openDashboard = () => {
  hideAll()

  //placeholder user
  let user = STATE.userName

  $.getJSON(`../events/${user}`, populateDashboard)
  $('#dash').removeAttr('hidden')
}

const populateDashboard = (res) =>{
  let now = Date.now()
  console.log(now)
  populateUpcomingEvents(res.filter(event => event.endTimeStamp > now))
  populateCompleteEvents(res.filter(event => event.endTimeStamp < now))
}

const populateCompleteEvents = (events) =>{
  console.log('COMPLETE', events)
  let allComplete = events.map(event => completeEventTemplate(event))
  $('#dash-complete').html('<h2>Complete Events</h2>' + allComplete)
  $('#dash-complete').find('.event-edit-button, .live-form-link').attr('hidden', true)
}

const completeEventTemplate = (event) =>{
  return `
    <div class="dash-event complete">
      ${everyEventTemplate(event)}
    </div>
  `
}

const populateUpcomingEvents = (events) =>{
  console.log('UPCOMING', events)
  let allUpcoming = events.map(event => upcomingEventTemplate(event))
  allUpcoming.unshift('<h2>Upcoming Events</h2>')
  $('#dash-upcoming').html(allUpcoming)
  $('#dash-upcoming').find('.event-feedback-link').attr('hidden', true)
}


const upcomingEventTemplate = (event) =>{
  return `
    <div class="dash-event upcoming">
      ${everyEventTemplate(event)}
    </div>
  `
}

const everyEventTemplate = (event) => {
  return`
    <h3><a id="info${event.eventId}" class="event-title js-event-info-link" href="15">${event.title}</a></h3>
    <span>${convertTimeStampToDate(event.endTimeStamp)}</span>
    <span><a id="${event.code}" class="live-form-link" href="URL">Live Form</a></span>
    <span>Event Code: ${event.code}</span>
    <span><a id="feedback${event.eventId}" class="event-feedback-link js-event-info-link" href="URL">Feedback Info</a></span>
    <button id="edit${event.eventId}" class="event-edit-button">Edit</button>
    <button id="remove${event.eventId}" class="event-remove-button">Remove</button>
  `
}





//Listeners

const eventInfoLinkListener = () => {
  $('#dash').on('click', '.js-event-info-link', function(event){
    event.preventDefault()
    // Need some what to store the data so we can make the correct API request based upon the link for now we'll leave a place holder
    let eventId = this.id.replace('info', '').replace('feedback', '')
    
    openEventInfo(eventId)
  })
}

const openLiveForm = (id) =>{
  // use the id to pick the correct URL
  console.log('GET the feedback code for the specific form')
  window.open('./feedback.html', '_blank')
}

const eventLiveFormLinkListener = () =>{
  $('main').on('click', '.live-form-link', function(event){
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