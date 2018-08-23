const STATE = {
  token: "",
  //This is used whenever PUT/DELETE happens to a current event
  focusEventId: 0
};

let token = localStorage.getItem("token");
if (token) {
  //  try to refresh token. ()
  //  success(){
  //    STATE.token = newtoken;
  //    localStorage.setItem("token", newtoken);
  //    clearLandingInputs();
  //    openDashboard();
  //    switchToAuthNav();
  //  },
  //  fails(){
  //    localStorage.setItem("token", ""); // clear expired token
  //  }
}

const manageApp = () => {
  //It's a nav bar ya'll.
  manageNav();

  //This includeds the SingUp/LogIn Functions
  manageLandingPage();

  //Dashoboard is the default screen which lists all the events created by the user
  manageDashboard();

  //This will probably be modal window that pops up over the current display
  // Much of the CRUD operations/listeners are in here
  manageEventEditor();

  //There is a section devoted to specific EVENT info.
  //Currently it has not specific listeners

  //This is a modal window that pops up to confirm before a DELETE happens
  manageRemoveConfirm();
};

//Useful Functions

// We have to convert time stamps a bunch.
const convertTimeStampToDate = (timeStamp, mode) => {
  let m = new Date(timeStamp);
  // to work with jquery formatting we have to make numbers less than 10 two digits by adding a zero
  const addZero = number => {
    if (number < 10) {
      return `0${number}`;
    } else {
      return number;
    }
  };

  let dateObject = {
    year: m.getUTCFullYear(),
    month: addZero(m.getUTCMonth() + 1),
    day: addZero(m.getUTCDate()),
    hour: addZero(m.getUTCHours()),
    minutes: addZero(m.getUTCMinutes())
  };

  let dateString =
    dateObject.year +
    " - " +
    dateObject.month +
    " - " +
    dateObject.day +
    " @ " +
    dateObject.hour +
    ":" +
    dateObject.minutes;

  // Sometimes we need a string, sometimes an object.
  if (mode === "object") {
    return dateObject;
  } else {
    return dateString;
  }
};
// When we're switching from screen to screen we often need to hide all the other screens.
const hideAll = () => {
  $("section").attr("hidden", true);
};

//NAV BAR

const manageNav = () => {
  //This will remove the JWT and clear the state
  // and return the user to the landing page
  logOutListener();
  // this returns the user to the events dashboard
  navEventLinkListener();
  // This toggles the mobile sub-menu
  subMenuToggleListener();
};

const subMenuToggleListener = () => {
  $("#nav-sub-menu-toggle").click(function(event) {
    event.preventDefault();
    if ($("#nav-sub-menu").attr("hidden")) {
      $("#nav-sub-menu").removeAttr("hidden");
    } else {
      $("#nav-sub-menu").attr("hidden", true);
    }
  });
};

// After they're authorized they get a different nav bar
const switchToAuthNav = () => {
  $("#nav-auth-no").attr("hidden", true);
  $("#nav-auth-yes").removeAttr("hidden");
};

//On logout we switch back to the default nav bar
const removeAuthNav = () => {
  $("#nav-auth-yes").attr("hidden", true);
  $("#nav-auth-no").removeAttr("hidden");
};

const logOutListener = () => {
  $(`#nav-log-out`).click(function(event) {
    event.preventDefault();
    STATE.token = "";
    localStorage.setItem("token", "");
    hideAll();
    $("#landing").removeAttr("hidden");
    removeAuthNav();
  });
};

// On the Auth nav this opens the event dashboard
const navEventLinkListener = () => {
  $("#nav-events").click(function(event) {
    event.preventDefault();
    openDashboard();
  });
};

//end NAV BAR
//

//LANDING (signup-Login)

const manageLandingPage = () => {
  // Submits the Sign Up Form
  signUpSubmitListener();
  // Navigates to singup interface
  signUpButtonListener();
  // Submits the login form
  logInSubmitLIstener();
  // Navigates to login interface
  logInButtonListener();
};

// Once a form is submitted we clear all the values
const clearLandingInputs = () =>
  $("#auth")
    .find("input")
    .val("");

//Sign Up Start
// These two functions are used by other sections of the app to navigate to SignUp
const signUpButtonListener = () => {
  $("#nav-sign-up, #sign-up-button, #sign-up-instead").click(function(event) {
    event.preventDefault();
    openSignUpInterface();
  });
};

const openSignUpInterface = () => {
  $("#auth, #auth-signup").removeAttr("hidden");
  // If the auth interface becomes a modal window I won't need to hide the landing
  $("#auth-login").attr("hidden", true);
};

// Startup Specific Functions
const signUpSubmitListener = () => {
  $("#signup-form-button").click(function(event) {
    event.preventDefault();
    signUpSubmit();
  });
};

const signUpSubmit = () => {
  let signUpInfo = {
    firstName: $("#signup-form-first").val(),
    lastName: $("#signup-form-last").val(),
    email: $("#signup-form-email").val(),
    password: $("#signup-form-pass1").val(),
    passwordCheck: $("#signup-form-pass2").val()
  };
  if (signUpInfo.password !== signUpInfo.passwordCheck) {
    $("#signup-form-pass1, #signup-form-pass2").val("");
    $("#sign-up-error").html("Passwords must Match");
  } else if (signUpInfo.password.length < 10) {
    $("#signup-form-pass1, #signup-form-pass2").val("");
    $("#sign-up-error").html("Password must be at least 10 characters");
  } else {
    $.ajax({
      url: "/api/hosts",
      type: "POST",
      data: JSON.stringify(signUpInfo),
      contentType: "application/json"
    })
      .then(host => {
        loginRequest(signUpInfo.email, signUpInfo.password);
      })
      .catch(err => $("#sign-up-error").html(err.responseJSON.message));
  }
};
// Sign up End

//Log In Start
// These functions are used by other parts of the app to navigate to the login interface
const logInButtonListener = () => {
  $("#log-in-button, #nav-log-in, #log-in-instead").click(function(event) {
    event.preventDefault();
    openLogInInterface();
  });
};

const openLogInInterface = () => {
  $("#auth, #auth-login").removeAttr("hidden");
  // If the auth interface becomes a modal window I won't need to hide the landing
  $("#auth-signup").attr("hidden", true);
};

// Login specific functions
const logInSubmitLIstener = () => {
  $("#login-form-button").click(function(event) {
    event.preventDefault();
    logInSubmit();
  });
};

const logInSubmit = () => {
  let email = $("#login-form-email").val();
  let password = $("#login-form-password").val();

  loginRequest(email, password);
};

function loginRequest(email, password) {
  let logInInfo = {
    email,
    password
  };
  $.ajax({
    url: "/api/auth/login",
    type: "POST",
    data: JSON.stringify(logInInfo),
    contentType: "application/json"
  })
    .then(res => {
      STATE.token = res.authToken;
      localStorage.setItem(`token`, STATE.token);
      clearLandingInputs();
      openDashboard();
      switchToAuthNav();
    })
    .catch(err => {
      console.log(err);
      $("#login-error").html(err.responseJSON.message);
    });
}

//end LANDING PAGE
//

// DASHBOARD

const manageDashboard = () => {
  // This will open Event info for a specific event
  eventInfoLinkListener();
  // This will open the URL/HTML form associated with a specific event
  eventLiveFormLinkListener();
};

//Listeners
// These are used on the dashboard as well as on specific event info pages.

const eventInfoLinkListener = () => {
  $("#dash").on("click", ".js-event-info-link", function(event) {
    event.preventDefault();
    // Need some what to store the data so we can make the correct API request based upon the link for now we'll leave a place holder
    let eventId = this.id.replace("info", "").replace("feedback", "");

    openEventInfo(eventId);
  });
};

const eventLiveFormLinkListener = () => {
  $("main").on("click", ".live-form-link", function(event) {
    event.preventDefault();
    window.open(`./${this.id}`, "_blank");
  });
};

// Dashboard specific functions
const openDashboard = () => {
  hideAll();
  // This makes sure to remove any specific event that was being looked at
  // so that if a new event is created you don't edit your old event instead.
  STATE.focusEventId = 0;
  // This takes the hostId (Which will also be stored in the JWT)
  // and grabs all associated events from that host
  // $.getJSON(`/api/events/`, populateDashboard);
  $.ajax({
    beforeSend: function(req){
      req.setRequestHeader('Authorization', `Bearer ${STATE.token}`)
    },
    url: "/api/events/",
    type: "GET",
    contentType: 'application/json'
  })
  .then(res => populateDashboard(res))
  .catch(err => console.log(err))

  $("#dash").removeAttr("hidden");
};

const populateDashboard = res => {
  let now = Date.now();
  // Events are sorted by whether or not they're complete or not
  populateEvents(res.filter(event => event.endTimeStamp > now), "upcoming");
  populateEvents(res.filter(event => event.endTimeStamp < now), "complete");
};

populateEvents = (events, type) => {
  let allEvents = events.map(event => eventTemplate(event, type));
  allEvents.unshift(`<h2>${type} Events</h2>`);
  $(`#dash-${type}`).html(allEvents); // todo capitalize type

  let elements =
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

//end DASHBOARD
//

//EVENT INFO STUFF

const openEventInfo = eventId => {
  hideAll();
  // This takes the Event id and makes that event the focused event.
  STATE.focusEventId = eventId;
  //Make a request for the info on this particular event using the id
  $.getJSON(`/api/events/${eventId}`, { hostId: STATE.hostId }, populateEventInfo);
  $("#info").removeAttr("hidden");
};

const populateEventInfo = res => {
  populateEventDetails(res);
  // If the event endTimeStamp is in the past will remove the instructions
  if (res.endTimeStamp > Date.now()) {
    populateEventInstructions(res);
    $("#details-end").html(
      "Event ends: " + convertTimeStampToDate(res.endTimeStamp)
    );
  } else {
    $("#info-instructions").attr("hidden", true);
    $("#info-details")
      .find(".event-edit-button")
      .attr("hidden", true);
    $("#details-end").html(
      "Event ended: " + convertTimeStampToDate(res.endTimeStamp)
    );
  }
};

// This is only displayed if the event hasn't happened
const populateEventInstructions = res => {
  $("#info-details")
    .find(".event-edit-button")
    .removeAttr("hidden");
  $("#info-instructions").removeAttr("hidden");
  $(".js-instructions-code").html(res.code);
  $("#instructions-phone").html(res.phone);
};

// These things are always displayed
const populateEventDetails = res => {
  $("#details-title").html(res.title);
  $("#details-host").html(res.host);
  $("#details-thanks").html(res.thanks);
  populateFeedbackGraphs(res);
  populateFeedbackInDepth(res);
};

const populateFeedbackGraphs = res => {
  console.log("THE GRAPHS HAPPEN");
};

const populateFeedbackInDepth = res => {
  // GET all the feedback associated with the event.
  $.getJSON(`/api/feedback/${res.eventId}`).then(feedbackarray => {
    // This filters out the feedback where nothing happened
    let feedbackOfValue = feedbackarray.filter(
      feedback => feedback.didAnything
    );
    if (feedbackOfValue.length > 0) {
      // This displays all the feedback on the website
      $("#feedback-in-depth").html(
        feedbackOfValue.map(feedback => feedbackTemplate(feedback))
      );
    } else {
      $("#feedback-in-depth").html("No Feedback");
    }
  });
};

const feedbackTemplate = feedback => {
  // If the person providing feedback opts in to more communication
  // then we display a more in depth display box
  if (feedback.optIn) {
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
    `;
  } else {
    return `
    <div class="feedback-single">
    <div>
    <span>${convertTimeStampToDate(feedback.timeStamp)}</span>
    <span>Anonymous</span>
    </div>
    <p>${feedback.content}</p>
    </div>
    `;
  }
};

//end EVENT INFO
//

/// EVENT EDITOR

const manageEventEditor = () => {
  // This is used in other screens and opens the event editor with a brand new event.
  newEventButtonListener();
  // This is used in other screens and opens the event editor with a pre-existing event
  eventEditButtonListener();
  // This is in the editor and sends out a PUT request to the server
  eventEditorSubmitButtonListener();
  // This is in the editor.
  // If the event is new, it sends a DELETE request to the server
  // If the event is pre-existing it simply returns to the event info page and makes no changes.
  eventEditorCancelButtonListener();
};

//eventEditButtonListener & new EventButtonListenter both open the editor
const eventEditButtonListener = () => {
  $("main").on("click", ".event-edit-button", function(event) {
    event.preventDefault();
    let eventId = this.id.replace("edit", "");

    if (eventId) {
      openEventEditor(eventId);
    } else {
      openEventEditor(STATE.focusEventId);
    }
  });
};

const newEventButtonListener = () => {
  $(".js-new-event-button").click(function(event) {
    console.log("listener");
    event.preventDefault();
    createEvent();
  });
};

const createEvent = () => {
  //Will create a POST a new, blank event in the database,
  // and upon a successful return it will open the event editor with the default values.
  let body = {
    hostId: STATE.hostId
  };
  $.ajax({
    url: "/api/events",
    type: "POST",
    data: JSON.stringify(body),
    contentType: "application/json"
  }).then(event => {
    console.log(event);
    openEventEditor(event.eventId);
  });
};

// Editor specifc Functions

const openEventEditor = eventId => {
  // The focus event has to updated inorder for Updates to edit the correct file.
  // This will also be doubled up with the JWT
  STATE.focusEventId = eventId;
  $.getJSON(`/api/events/${eventId}`, populateEventEditor);
  hideAll();
  $("#edit").removeAttr("hidden");
};

const populateEventEditor = res => {
  $("#edit-title").val(res.title);
  $("#edit-host").val(res.host);
  //DATE
  let date = convertTimeStampToDate(res.endTimeStamp, "object");
  $("#edit-date").val(`${date.year}-${date.month}-${date.day}`);
  $("#edit-time").val(`${date.hour}:${date.minutes}`);
  $("#edit-thanks").val(res.thanks);
};

const eventEditorSubmitButtonListener = () => {
  $("#edit-submit-button").click(function(event) {
    event.preventDefault();
    submitEventEdits();
    openEventInfo(STATE.focusEventId);
    clearEventEditorFields();
    //Maybe put in a thing that opens the live form in another tab?
  });
};

const submitEventEdits = () => {
  let endDate = $("#edit-date").val();
  let endTime = $("#edit-time").val();

  let eventInfo = {
    title: $("#edit-title").val(),
    host: $("#edit-host").val(),
    endTimeStamp: new Date(endDate + "T" + endTime).getTime(),
    thanks: $("#edit-thanks").val()
  };

  $.ajax({
    url: `/api/events/${STATE.focusEventId}`,
    type: "PUT",
    data: JSON.stringify(eventInfo),
    contentType: "application/json"
  });
};

const eventEditorCancelButtonListener = () => {
  $("#edit-cancel-button").click(function(event) {
    event.preventDefault();
    // If it's a brand new event it should delete the event as well
    if ("new") {
      deleteEvent();
      openDashboard();
    } else {
      openEventInfo(STATE.focusEventId);
    }
    clearEventEditorFields();
  });
};
const clearEventEditorFields = () =>
  $("#edit")
    .find("input, textarea")
    .val("");

//End EVENT EDITOR
//

//REMOVE CONFIRM

const manageRemoveConfirm = () => {
  // This exists on other screens and opens up the remove confirm interface
  eventRemoveButtonListener();
  // This is on RemoveConfirm and simply closes remove confirm
  removeCancleButtonListener();
  // This sends a DELETE request to the server to remove the Event
  removeConfirmButtonListener();
};

const eventRemoveButtonListener = () => {
  $("main").on("click", ".event-remove-button", function(event) {
    event.preventDefault();
    //Place Holder for actual id in state
    let removeId = this.id.replace("remove", "");
    if (removeId) {
      STATE.focusEventId = removeId;
      openRemoveConfirm(removeId);
    } else {
      openRemoveConfirm(STATE.focusEventId);
    }
  });
};

const openRemoveConfirm = id => {
  $.getJSON(`/api/events/${id}`, function(res) {
    $("#remove-title").html(res.title);
  });
  hideAll();
  $("#remove").removeAttr("hidden");
};

const removeConfirmButtonListener = () => {
  $("#confirm-delete-button").click(function(event) {
    event.preventDefault();
    deleteEvent();
    openDashboard();
  });
};

const deleteEvent = () => {
  // Make a DELETE request to the server

  $.ajax({
    url: `/api/events/${STATE.focusEventId}`,
    type: "DELETE",
    // data: JSON.stringify(query),
    contentType: "application/json"
  });
};

const removeCancleButtonListener = () => {
  $("#cancel-delete-button").click(function(event) {
    event.preventDefault();
    openDashboard();
  });
};

//end REMOVE CONFIRM
//

$(manageApp());
