//Useful Functions

const hideAll = () =>{
  $('section').attr('hidden', true)
}

// LIVE FORM STUFF
const openLiveForm = (id) =>{
  // use the id to pick the correct URL
  window.open('./feedback.html', '_blank')
  console.log('LIVE FORM OPENS IN NEW WINDOW/TAB')
}

//NAV STUFF

const logOutListener = () =>{
  $(`#nav-log-out`).click(function(event){
    event.preventDefault()
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

//EVENT INFO stuff

const openEventInfo = (id) =>{
  hideAll()
  //Make a request for the info on this particular event using the id
  console.log('Grabbing event info for event # ', id)
  $('#info').removeAttr('hidden')
}


//EVENT EDITOR STUFF
const openEventEditor = () =>{
  hideAll()
  $('#edit').removeAttr('hidden')
}

const eventEditorSubmitButtonListener = () =>{
  $('#edit-submit-button').click(function(event){
    event.preventDefault()
    submitEventEdits()
    openEventInfo()
    //Maybe put in a thing that opens the live form in another tab?
  })
}

const submitEventEdits = () =>{
  console.log('PUT event update')
}

const eventEditorCancelButtonListener = () =>{
  $('#edit-cancel-button').click(function(event){
    event.preventDefault()
    openDashboard()
    // If it's a brand new event it should delete the event as well
  })
}



//REMOVE CONFIRM stuff

const openRemoveConfirm = (id) =>{
  // This will probably be a modal window so we might not need to hide stuff
  hideAll()
  $('#remove').removeAttr('hidden')
}

const removeConfirmButtonListener = () =>{
  $('#confirm-delete-button').click(function(event){
    deleteEvent()
    openDashboard()
  })
}

const deleteEvent = () =>{
  // Make a DELETE request to the server
  console.log('EVENT DELETED')
}

const removeCancleButtonListener = () =>{
  $('#cancel-delete-button').click(function(event){
    openDashboard()
  })
}

//DASHBOARD Stuff

const openDashboard = () => {
  hideAll()
  // Make a request to the server for dashboard info
  $('#dash').removeAttr('hidden')
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
    console.log('live form link listener')
    // Placeholder for actual id in state
    let id = 15
    openLiveForm(id)
  })
}

const eventEditButtonListener = () =>{
  $('main').find('.event-edit-button').on('click', function(event){
    event.preventDefault()
    //Populate the event editor with appropriate info
    openEventEditor()
  })
}

const eventRemoveButtonListener = () =>{
  $('main').find('.event-remove-button').on('click', function(event){
    event.preventDefault()
    //Place Holder for actual id in state
    let id = 15
    openRemoveConfirm(id)
  })
}

const newEventButtonListener = () => {
  $('.js-new-event-button').click(function(event){
    event.preventDefault()
    createEvent()
  })
}

const createEvent = () =>{
  //Will create a POST a new, blank event in the database and upon a successful return, it will open the event editor with the default values.
  openEventEditor()
}

//SIGN UP AND LOGIN 

const signUpSubmit = () =>{
  
  if('checksPass'){
    openDashboard()
    switchToAuthNav()
  } else {
    // Point out errors
    console.log('Something Went wrong')
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
  if('checksPass'){
    openDashboard()
    switchToAuthNav()
  } else {
    // Point out errors
    console.log('Something Went wrong')
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
    console.log(this)
    openSignUpInterface()
  })
}

const logInButtonListener = () =>{
  $('#log-in-button, #nav-log-in, #log-in-instead').click(function(event){
    event.preventDefault()
    console.log(this)
    openLogInInterface()
  })
}



const manageApp = () =>{
  eventEditorSubmitButtonListener()
  eventEditorCancelButtonListener()

  removeCancleButtonListener()
  removeConfirmButtonListener()

  eventRemoveButtonListener()
  eventEditButtonListener()
  eventLiveFormLinkListener()
  eventInfoLinkListener()
  newEventButtonListener()

  logOutListener()
  navEventLinkListenter()

  signUpSubmitListener()
  signUpButtonListener()
  logInSubmitLIstener()
  logInButtonListener()
}


$(manageApp())
