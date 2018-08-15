STATE = {
  feedbackId:'',
}

const manageApp = () =>{
  // This populates the page on load and GETS the event info from the database based on the event code
  populateFeedback()
  // This listends for the submit button to be activated
  submitListener()
  // This listens for the opt in check box to be checked
  optInListener()
}



const populateFeedback = () => {
  // We grab the event code from the URL and then get the corresponding event info
  let url = window.location.href
  let eventCode = url.substr(url.lastIndexOf('/') + 1).toLocaleUpperCase()
  $.getJSON(`../events/`, { eventCode }, function(res){
    $('.js-event-title').html(res.title)
    $('.js-event-host').html(res.host)
    $('#thanks').html(res.thanks)
  })

  // Then we POST a new feedback request. It's a default feedback, 
  // and it is flagged as non-updated with the feedback.didAnything = false
  // Seeing how many people bounce on the website will be useful information for the producer (and developers)
  createFeedback(eventCode)
}

const createFeedback = (eventCode) =>{

  $.ajax({
    url: "../feedback",
    type: "POST",
    data: JSON.stringify({eventCode}),
    contentType: 'application/json'
  })
    .then(res => {
      STATE.feedbackId = res._id
    })
}

const optInListener = () =>{
  // When they opt in to more info/communication,
  // Extra fields are displayed and the feedback is updated.
  $('#opt-in-check').click(function(event){
    if(document.getElementById('opt-in-check').checked){
      $('#feedback-extra').removeAttr('hidden')
      $('#opt-in-check').attr('checked', true)
      updateFeedback()
    } else {
      $('#feedback-extra').attr('hidden', true)
    }
  })
}

const submitListener = () =>{
  // The feedback is updated and then the form switches over to a custom thank you message 
  $('#feedback-button').click(function(event){
    event.preventDefault()
    updateFeedback()
    $('#feedback-form').attr('hidden', true)
    $('#thanks').removeAttr('hidden')
  })
}

const updateFeedback = () =>{
  // Takes the info from the form and then flags the feedback as a non-trivial response.

  let feedbackObj = {
    content: $('#feedback-text').val(),
    optIn: document.getElementById('opt-in-check').checked,
    name: $('#feedback-name').val(),
    email: $('#feedback-email').val(),
    phone: $('#feedback-phone').val(),
    updates: document.getElementById('update-check').checked,
    feedback: document.getElementById('feedback-check').checked,
    volunteer: document.getElementById('volunteer-check').checked,
    didAnything: true,
  }
  $.ajax({
    url: `../feedback/${STATE.feedbackId}`,
    type: "PUT",
    data: JSON.stringify(feedbackObj),
    contentType: 'application/json'
  })
}

$(manageApp())