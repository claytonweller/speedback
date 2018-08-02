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