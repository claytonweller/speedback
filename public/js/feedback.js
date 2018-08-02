

const optInListener = () =>{
  $('#opt-in-check').click(function(event){
    if(document.getElementById('opt-in-check').checked){
      $('#feedback-extra').removeAttr('hidden')
      // This will PUT an update to the server
      updateFeedback()
    } else {
      $('#feedback-extra').attr('hidden', true)
    }
  })
}

const submitListener = () =>{
  //PUT an update to the 
  $('#feedback-button').click(function(event){
    event.preventDefault()
    updateFeedback()
    $('#feedback-form').attr('hidden', true)
    $('#thanks').removeAttr('hidden')
  })
}

const updateFeedback = () =>{
  console.log('UPDATE feedback')
  let feedbackObj = {
    content: $('#feedback-text').val(),
    optIn: document.getElementById('opt-in-check').checked,
    name: $('#feedback-name').val(),
    email: $('#feedback-email').val(),
    phone: $('#feedback-phone').val(),
    updates: document.getElementById('update-check').checked,
    feedback: document.getElementById('feedback-check').checked,
    volunteer: document.getElementById('volunteer-check').checked
  }
  console.log(feedbackObj)
  // PUT request to the Server
}

const populateFeedback = () => {
  console.log('GET the information for the specific event')
  createFeedback()
}

const createFeedback = () =>{
  console.log('POST feedback')
}

const manageApp = () =>{
  submitListener()
  optInListener()
  populateFeedback()
}

$(manageApp())