STATE = {
  feedbackId:'',
}

const optInListener = () =>{
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

const populateFeedback = () => {
  let url = window.location.href
  let eventCode = url.substr(url.lastIndexOf('/') + 1).toLocaleUpperCase()
  console.log(eventCode)
  $.getJSON(`../events/`, { eventCode }, function(res){
    $('.js-event-title').html(res.title)
    $('.js-event-host').html(res.host)
    $('#thanks').html(res.thanks)
  })
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

const manageApp = () =>{
  submitListener()
  optInListener()
  populateFeedback()
}

$(manageApp())