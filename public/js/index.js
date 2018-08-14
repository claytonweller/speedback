const STATE = {
  //I'll probably replace this with the token?
  hostId:'5b70addf8e4cf51e0c7936d1',
  //This is used whenever PUT/DELETE happen to a current event
  focusEventId:0
}

const manageApp = () =>{

  //It's a nav bar ya'll.
  manageNav()

  //This includeds the SingUp/LogIn Functions
  manageLandingPage()

  //Dashoboard is the default screen which lists all the events created by the user
  manageDashboard()

  //This will probably be modal window that pops up over the current display
  // Much of the CRUD operations/listeners are in here
  manageEventEditor()

  //There is a section devoted to specific EVENT info.
    //Currently it has not specific listeners
  
  //This is a modal window that pops up to confirm before a DELETE happens
  manageRemoveConfirm()
}


//Useful Functions

const convertTimeStampToDate = (timeStamp, mode) => {
  let m = new Date(timeStamp)

  const addZero = number =>{
    if(number < 10) {
      return `0${number}`
    } else {
      return number
    }
  }  
  
  let dateObject = {
    year: m.getUTCFullYear(),
    month: addZero((m.getUTCMonth()+1)), 
    day: addZero(m.getUTCDate()), 
    hour: addZero(m.getUTCHours()),
    minutes: addZero(m.getUTCMinutes())
  }

  let dateString = 
    dateObject.year +" - "+ 
    dateObject.month +" - "+ 
    dateObject.day + " @ " + 
    dateObject.hour + ":" + 
    dateObject.minutes;

  if (mode === 'object'){
    return dateObject 
  } else {
    return dateString
  
  }
  
}

const hideAll = () =>{
  $('section').attr('hidden', true)
}

//NAV BAR

const switchToAuthNav = () =>{
  $('#nav-auth-no').attr('hidden', true)
  $('#nav-auth-yes').removeAttr('hidden')
}

const removeAuthNav = () =>{
  $('#nav-auth-yes').attr('hidden', true)
  $('#nav-auth-no').removeAttr('hidden')
}

const logOutListener = () =>{
  $(`#nav-log-out`).click(function(event){
    event.preventDefault()
    console.log('Remove the JWS token')
    hideAll()
    $('#landing').removeAttr('hidden') 
    removeAuthNav() 
  })
}

const navEventLinkListenter = () =>{
  $('#nav-events').click(function(event){
    event.preventDefault()
    openDashboard()
  })
}

const manageNav = () =>{
  logOutListener()
  navEventLinkListenter()
}

  //end NAV BAR
//



//LANDING (signup-Login) 

const clearLandingInputs = () => $('#auth').find('input').val('')

const signUpSubmit = () =>{
  
  console.log('POST user info, and return their JWS token')
  let signUpInfo = {
    firstName: $('#signup-form-first').val(),
    lastName: $('#signup-form-last').val(),
    email: $('#signup-form-email').val(),
    password: $('#signup-form-pass1').val(),
    passwordCheck: $('#signup-form-pass2').val(),
  }
  if(signUpInfo.password !== signUpInfo.passwordCheck){
    $('#signup-form-pass1, #signup-form-pass2').val('')
    $('#sign-up-error').html('Passwords must Match')
  } else if(signUpInfo.password.length < 10) {
    $('#signup-form-pass1, #signup-form-pass2').val('')
    $('#sign-up-error').html('Password must be at least 10 characters')
  }  else {

    $.ajax({
      url: "../hosts",
      type: "POST",
      data: JSON.stringify(signUpInfo),
      contentType: 'application/json'
    })
      .then(host => {
        STATE.hostId = host.hostId
        clearLandingInputs()
        openDashboard()
        switchToAuthNav()
      })
      .catch(err => $('#sign-up-error').html(err.responseJSON.message))
  } 

}

const signUpSubmitListener = () =>{
  $('#signup-form-button').click(function(event){
    event.preventDefault()
    signUpSubmit()
  })
}

const logInSubmit = () =>{
  console.log('GET user info, confirm that info is correct, return JWS token')
  
  let logInInfo = {
    email: $('#login-form-email').val(),
    password: $('#login-form-password').val(),
  }

  // This will change after JWT is put in place
  $.getJSON('./hosts/', logInInfo)
    .then(res => {
      STATE.hostId = res.hostId
      clearLandingInputs()
      openDashboard()
      switchToAuthNav()
    })
    .catch(err => {
      console.log(err)
      $('#login-error').html(err.responseJSON.message)
    })


  // $.ajax({
  //   url: "../auth/login",
  //   type: "POST",
  //   data: JSON.stringify(logInInfo),
  //   contentType: 'application/json'
  // })
  //   .then(thing => console.log(thing))
  //   .catch(err => console.log(err))


  // if('checksPass'){

  // } else {
  //   // Point out errors
  // }

}

const logInSubmitLIstener = () =>{
  $('#login-form-button').click(function(event){
    event.preventDefault()
    logInSubmit()
  })
}

const openSignUpInterface = () =>{
  $('#auth, #auth-signup').removeAttr('hidden')
  // If the auth interface becomes a modal window I won't need to hide the landing
  $('#landing, #auth-login').attr('hidden', true)
}

const openLogInInterface = () => {
  $('#auth, #auth-login').removeAttr('hidden')
  // If the auth interface becomes a modal window I won't need to hide the landing
  $('#landing, #auth-signup').attr('hidden', true)
}

const signUpButtonListener = () =>{
  $('#nav-sign-up, #sign-up-button, #sign-up-instead').click(function(event){
    event.preventDefault()
    openSignUpInterface()
  })
}

const logInButtonListener = () =>{
  $('#log-in-button, #nav-log-in, #log-in-instead').click(function(event){
    event.preventDefault()
    openLogInInterface()
  })
}

const manageLandingPage = () =>{
  signUpSubmitListener()
  signUpButtonListener()
  logInSubmitLIstener()
  logInButtonListener()
}

  //end LANDING PAGE
//


// DASHBOARD

const openDashboard = () => {
  hideAll()
  STATE.focusEventId = 0
  $.getJSON(`../events/`, {hostId:STATE.hostId}, populateDashboard);
  $("#dash").removeAttr("hidden");
};

const populateDashboard = res => {
  let now = Date.now();
  populateUpcomingEvents(res.filter(event => event.endTimeStamp > now));
  populateCompleteEvents(res.filter(event => event.endTimeStamp < now));
};

const populateCompleteEvents = events => {
  console.log("COMPLETE", events);
  let allComplete = events.map(event => eventTemplate(event, "complete"));
  $("#dash-complete").html("<h2>Complete Events</h2>" + allComplete);
  $("#dash-complete")
    .find(".event-edit-button, .live-form-link")
    .attr("hidden", true);
};
const populateUpcomingEvents = events => {
  console.log("UPCOMING", events);
  let allUpcoming = events.map(event => eventTemplate(event));
  allUpcoming.unshift("<h2>Upcoming Events</h2>");
  $("#dash-upcoming").html(allUpcoming);
  $("#dash-upcoming")
    .find(".event-feedback-link")
    .attr("hidden", true);
};

populateEvents = (events, type) => {
  let renderedEvents = events.map(event => eventTemplate(event, type));
  $(`#dash-${type}`).html(`<h2>${type} Events</h2>` + allComplete); // todo capitalize type

  var elements =
    type === "upcoming"
      ? ".event-feedback-link"
      : ".event-edit-button, .live-form-link";

  $(`#dash-${type}`)
    .find(elements)
    .attr("hidden", true);
};

const eventTemplate = (event, type) => {
  return `
    <div class="dash-event ${type}">
    <h3><a id="info${
      event.eventId
    }" class="event-title js-event-info-link" href="15">${event.title}</a></h3>
    <span>${convertTimeStampToDate(event.endTimeStamp)}</span>
    <span><a id="${
      event.code
    }" class="live-form-link" href="URL">Live Form</a></span>
    <span>Event Code: ${event.code}</span>
    <span><a id="feedback${
      event.eventId
    }" class="event-feedback-link js-event-info-link" href="URL">Feedback Info</a></span>
    <button id="edit${event.eventId}" class="event-edit-button">Edit</button>
    <button id="remove${
      event.eventId
    }" class="event-remove-button">Remove</button>
    </div>
  `;
};

  //Listeners

const eventInfoLinkListener = () => {
  $("#dash").on("click", ".js-event-info-link", function(event) {
    event.preventDefault();
    // Need some what to store the data so we can make the correct API request based upon the link for now we'll leave a place holder
    let eventId = this.id.replace("info", "").replace("feedback", "");

    openEventInfo(eventId);
  });
};

const eventLiveFormLinkListener = () => {
  $("main").on("click", ".live-form-link", function(event) {
    event.preventDefault();
    openLiveForm(this.id);
  });
};

const openLiveForm = eventCode => window.open(`./${eventCode}`, "_blank")


const manageDashboard = () => {
  eventInfoLinkListener();
  eventLiveFormLinkListener();
};

  //end DASHBOARD
//


//EVENT INFO STUFF

const openEventInfo = (id) =>{
  hideAll()
  STATE.focusEventId = id
  //Make a request for the info on this particular event using the id
  $.getJSON(`./events/${id}`, {hostId:STATE.hostId}, populateEventInfo)
  $('#info').removeAttr('hidden')
}

const populateEventInfo = (res) =>{
  console.log(res)
  populateEventDetails(res)

  if(res.endTimeStamp > Date.now()){
    populateEventInstructions(res)
    $('#details-end').html('Event ends: ' + convertTimeStampToDate(res.endTimeStamp))
  } else {
    populateEventFeedback(res)    
    $('#details-end').html('Event ended: ' + convertTimeStampToDate(res.endTimeStamp))
  }
}

const populateEventDetails = (res) =>{
  $('#details-title').html(res.title)
  $('#details-host').html(res.host)
  $('#details-thanks').html(res.thanks)
}

const populateEventInstructions = (res) => {
  $('#info-details').find('.event-edit-button').removeAttr('hidden')
  $('#info-feedback').attr('hidden', true)
  $('#info-instructions').removeAttr('hidden')
  $('.js-instructions-code').html(res.code)
  $('#instructions-phone').html(res.phone)
}

const populateEventFeedback = (res) => {
  $('#info-details').find('.event-edit-button').attr('hidden', true)
  $('#info-instructions').attr('hidden', true)
  $('#info-feedback').removeAttr('hidden')
  populateFeedbackGraph(res)
  populateFeedbackInDepth(res)
}

const populateFeedbackGraph = (res) => {
  console.log('THE GRAPH HAPPENS')
}

const populateFeedbackInDepth = (res) =>{
  $.getJSON(`./feedback/${res.eventId}`)
    .then(feedbackarray => {
      let feedbackOfValue = feedbackarray.filter(feedback => feedback.didAnything)
      $('#feedback-in-depth').html(feedbackOfValue.map(feedback => feedbackTemplate(feedback)))
    })
  
}

// Will need to list all Feedback info
// Will need to synthesize the info into some useful graphs/displays

const feedbackTemplate = (feedback) => {
  
  if(feedback.optIn){
    return `
      <div class="feedback-single">
        <div>
          <span>${convertTimeStampToDate(feedback.timeStamp)}</span>
          <span>${feedback.name}</span>
          <span>${feedback.email}</span>
          <span>${feedback.phone}</span>
        </div>
        <div>
          <span>Info about future shows: ${feedback.updates}</span>
          <span>More feedback: ${feedback.feedback}</span>
          <span>Volunteer: ${feedback.volunteer}</span>
        </div>
        <p>${feedback.content}</p>
      </div> 
  `
  } else {
    return `
      <div class="feedback-single">
        <div>
          <span>${convertTimeStampToDate(feedback.timeStamp)}</span>
          <span>Anonymous</span>
        </div>
        <p>${feedback.content}</p>
      </div> 
    `
  }
}

  //end EVENT INFO
//



/// EVENT EDITOR

const clearEventEditorFields = () => $('#edit').find('input, textarea').val('')

const createEvent = () =>{
  //Will create a POST a new, blank event in the database and upon a successful return, it will open the event editor with the default values.
  let body = {
    hostId: STATE.hostId
  }
  $.ajax({
    url: "../events",
    type: "POST",
    data: JSON.stringify(body),
    contentType: 'application/json'
  })
    .then(event => {
      console.log(event)
      openEventEditor(event.eventId)
    })
}

const openEventEditor = eventId =>{
  STATE.focusEventId = eventId
  $.getJSON(`../events/${eventId}`, populateEventEditor)
  hideAll()
  $('#edit').removeAttr('hidden')
}

const populateEventEditor = (res) =>{
  $('#edit-title').val(res.title)
  $('#edit-host').val(res.host)
  //DATE
  let date = convertTimeStampToDate(res.endTimeStamp, 'object')



  $('#edit-date').val(`${date.year}-${date.month}-${date.day}`)
  $('#edit-time').val(`${date.hour}:${date.minutes}`)
  $('#edit-thanks').val(res.thanks)

}

const submitEventEdits = () =>{
  
  let endDate = $('#edit-date').val()
  let endTime = $('#edit-time').val()

  let eventInfo = {
    title: $('#edit-title').val(),
    host: $('#edit-host').val(),
    endTimeStamp: new Date(endDate+'T'+endTime).getTime(),
    thanks: $('#edit-thanks').val()
  }

  $.ajax({
    url: `../events/${STATE.focusEventId}`,
    type: "PUT",
    data: JSON.stringify(eventInfo),
    contentType: 'application/json'
  })
}

  //Listeners

const eventEditButtonListener = () =>{
  $('main').on('click', '.event-edit-button', function(event){
    event.preventDefault()
    let eventId = this.id.replace("edit", "")
    
    if (eventId){
      openEventEditor(eventId)  
    } else {
      openEventEditor(STATE.focusEventId)
    }
    
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
      openEventInfo(STATE.focusEventId)
    }
    clearEventEditorFields()
    
  })
}

const eventEditorSubmitButtonListener = () =>{
  $('#edit-submit-button').click(function(event){
    event.preventDefault()
    submitEventEdits()
    openEventInfo(STATE.focusEventId)
    clearEventEditorFields()
    //Maybe put in a thing that opens the live form in another tab?
  })
}

const newEventButtonListener = () => {
  $('.js-new-event-button').click(function(event){
    console.log('listener')
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

  //End EVENT EDITOR
//




//REMOVE CONFIRM

const eventRemoveButtonListener = () =>{
  $('main').on('click', '.event-remove-button', function(event){
    event.preventDefault()
    //Place Holder for actual id in state
    let removeId = this.id.replace('remove', '')
    if (removeId){
      STATE.focusEventId = removeId
      openRemoveConfirm(removeId)
    } else {
      openRemoveConfirm(STATE.focusEventId)
    }
    
  })
}

const openRemoveConfirm = (id) =>{
  $.getJSON(`../events/${id}`, function(res){
    $('#remove-title').html(res.title)
  })
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
  
  $.ajax({
    url: `../events/${STATE.focusEventId}`,
    type: "DELETE",
    // data: JSON.stringify(query),
    contentType: 'application/json'
  })

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

  //end REMOVE CONFIRM
//



$(manageApp())