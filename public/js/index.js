const STATE = {
  //I'll probably replace this with the token?
  userName: 'cdubs'
}

$(manageApp())

const manageApp = () =>{

  //It's a nav bar ya'll.
  manageNav()

  //This includeds the SingUp/LogIn Functions
  manageLandingPage()

  //Dashoboard is the default screen which lists all the events that can recieve feedback
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

const convertTimeStampToDate = (timeStamp) => {
  let m = new Date(timeStamp)
  let dateString = 
    m.getUTCFullYear() +" - "+ 
    (m.getUTCMonth()+1) +" - "+ 
    m.getUTCDate() + " @ " + 
    m.getUTCHours() + ":" + 
    m.getUTCMinutes()
  return dateString
}

const hideAll = () =>{
  $('section').attr('hidden', true)
}

//NAV BAR

const logOutListener = () =>{
  $(`#nav-log-out`).click(function(event){
    event.preventDefault()
    console.log('Remove the JWS token')
    hideAll()
    $('#landing').removeAttr('hidden') 
    removeAuthNav() 
  })
}

const switchToAuthNav = () =>{
  $('#nav-auth-no').attr('hidden', true)
  $('#nav-auth-yes').removeAttr('hidden')
}

const removeAuthNav = () =>{
  $('#nav-auth-yes').attr('hidden', true)
  $('#nav-auth-no').removeAttr('hidden')
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
    userName: $('#signup-form-user').val(),
    email: $('#signup-form-email').val(),
    password1: $('#signup-form-pass1').val(),
    password2: $('#signup-form-pass2').val(),
  }
  console.log(signUpInfo)

  if('checksPass'){
    clearLandingInputs()
    openDashboard()
    switchToAuthNav()
  } else {
    // Point out errors
  }
  /* 
    Checks I'll have to make:
      All Fields Filled out
      All Fields are appropriately formatted
      Passwords match
      Password is a meets certain requirements
      That the email isn't already used for an account
  */
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

  console.log(logInInfo)

  if('checksPass'){
    clearLandingInputs()
    openDashboard()
    switchToAuthNav()
  } else {
    // Point out errors
  }
  /* 
    Checks I'll have to make:
      All Fields Filled out
      All Fields are appropriately formatted
      Confirm that the user exists
      Confirm that the users credentials match
  */
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
  hideAll();

  //placeholder user
  let user = STATE.userName;

  $.getJSON(`../events/${user}`, populateDashboard);
  $("#dash").removeAttr("hidden");
};

const populateDashboard = res => {
  let now = Date.now();
  console.log(now);
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

const openLiveForm = id => {
  // use the id to pick the correct URL
  console.log("GET the feedback code for the specific form");
  window.open("./feedback.html", "_blank");
};

const eventLiveFormLinkListener = () => {
  $("main").on("click", ".live-form-link", function(event) {
    event.preventDefault();
    // Placeholder for actual id in state
    let id = 15;
    openLiveForm(id);
  });
};

const manageDashboard = () => {
  eventInfoLinkListener();
  eventLiveFormLinkListener();
};

  //end DASHBOARD
//




/// EVENT EDITOR

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

  //End EVENT EDITOR
//



//EVENT INFO STUFF

const openEventInfo = (id) =>{
  hideAll()
  let user = STATE.userName
  //Make a request for the info on this particular event using the id
  console.log('GET detailed event info ', id)
  $.getJSON(`./events/${user}/${id}`, populateEventInfo)
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
  populateFeedbackInDepth(res.feedback)
}

const populateFeedbackGraph = (res) => {
  console.log('THE GRAPH HAPPENS')
}

const populateFeedbackInDepth = (feedbackArray) =>{
  console.log(feedbackArray)
  let inDepthFeedback = feedbackArray.map(feedback => feedbackTemplate(feedback))
  inDepthFeedback.unshift(`<h3>Individual responses</h3>`)
  $('#feedback-in-depth').html(inDepthFeedback)
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


//REMOVE CONFIRM

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

  //end REMOVE CONFIRM
//



