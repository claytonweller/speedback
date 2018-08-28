STATE = {
  feedbackId: "",
  didAnything: false,
  code: ""
};

const manageApp = () => {
  // This populates the page on load and GETS the event info from the database based on the event code
  populateFeedback();
  // This listends for the submit button to be activated
  submitListener();
  // This listens for the opt in check box to be checked
  optInListener();
};

const populateFeedback = () => {
  // We grab the event code from the URL and then get the corresponding event info
  let url = window.location.href;
  let eventCode = url.substr(url.lastIndexOf("/") + 1).toLocaleUpperCase();
  STATE.code = eventCode;
  $.getJSON(`api/events/code/${eventCode}`, function(res) {
    $(".js-event-title").html(res.title);
    $(".js-event-host").html(res.displayName);
    $("#thanks").html(res.thanks);
    countVisit(res.eventId);
  });
};

const countVisit = eventId => {
  $.ajax({
    url: `/api/feedback/visited/${eventId}`,
    type: "POST",
    contentType: "application/json"
  });
};

const optInListener = () => {
  // When they opt in to more info/communication,
  // Extra fields are displayed and the feedback is updated.
  $("#opt-in-check").click(function(event) {
    if ($("#opt-in-check").is(":checked")) {
      $("#feedback-extra").removeAttr("hidden");
      $("#feedback-extra").attr("display", "flex");
      $("#opt-in-check").attr("checked", true);
      sortSubmitClicks();
    } else {
      $("#feedback-extra").attr("hidden", true);
    }
  });
};

const submitListener = () => {
  // The feedback is updated and then the form switches over to a custom thank you message
  $("#feedback-button").click(function(event) {
    event.preventDefault();
    sortSubmitClicks();
    $("#feedback-form").attr("hidden", true);
    $("#thanks").removeAttr("hidden");
  });
};

const sortSubmitClicks = () => {
  let feedbackObj = {
    content: $("#feedback-text").val(),
    optIn: document.getElementById("opt-in-check").checked,
    name: $("#feedback-name").val(),
    email: $("#feedback-email").val(),
    phone: $("#feedback-phone").val(),
    updates: document.getElementById("update-check").checked, // TODO
    feedback: document.getElementById("feedback-check").checked,
    volunteer: document.getElementById("volunteer-check").checked
  };

  if (STATE.didAnything) {
    updateFeedback(feedbackObj);
  } else {
    STATE.didAnything = true;
    createFeedback(feedbackObj);
  }
};

const createFeedback = feedbackObj => {
  $.ajax({
    url: `/api/feedback/${STATE.code}`,
    type: "POST",
    data: JSON.stringify(feedbackObj),
    contentType: "application/json"
  }).then(res => {
    STATE.feedbackId = res._id;
  });
};

const updateFeedback = feedbackObj => {
  $.ajax({
    url: `/api/feedback/${STATE.feedbackId}`,
    type: "PUT",
    data: JSON.stringify(feedbackObj),
    contentType: "application/json"
  });
};

$(manageApp());
