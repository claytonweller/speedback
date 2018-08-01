const hideAll = () =>{
  $('section').attr('hidden', true)
}

//DASHBOARD Stuff

const openDashboard = () => {
  console.log('Opening dash')
  hideAll()
  $('#dash').removeAttr('hidden')
}


//SIGN UP AND LOGIN 

const switchToAuthNav = () =>{
  $('#nav-auth-no').attr('hidden', true)
  $('#nav-auth-yes').removeAttr('hidden')
}



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

  signUpSubmitListener()
  signUpButtonListener()
  logInSubmitLIstener()
  logInButtonListener()
}


$(manageApp())