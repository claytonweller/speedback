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



// Will need to list all Feedback info

// Will need to synthesize the info into some useful graphs/displays

