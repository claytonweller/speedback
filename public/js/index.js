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

const manageApp = () =>{
  //This includeds the SingUp/LogIn Functions
  manageLandingPage()

  //Dashoboard is the default screen which lists all the events that can recieve feedback
  manageDashboard()

  //It's a nav bar ya'll.
  manageNav()

  //This will probably be modal window that pops up over the current display
  // Much of the CRUD operations/listeners are in here
  manageEventEditor()

  //This is a modal window that pops up to confirm before a DELETE happens
  manageRemoveConfirm()
}


$(manageApp())
