const STATE = {
  token: "",
  focusEventId: 0 // This is used whenever PUT/DELETE happens to a current event
};

let token = localStorage.getItem("token");
if (token) {
  $.ajax({
    url: "/api/auth/refresh",
    type: "POST",
    headers: { Authorization: `Bearer ${token}` },
    contentType: "application/json"
  })
    .then(res => {
      STATE.token = res.authToken;
      localStorage.setItem("token", res.authToken);
      openDashboard();
      switchToAuthNav();
    })
    .catch(err => {
      localStorage.setItem("token", "");
      $("#landing").removeAttr("hidden");
    });
} else {
  $("#landing").removeAttr("hidden");
}

function manageApp() {
  // It's a nav bar ya'll.
  manageNav();

  // This includeds the SingUp/LogIn Functions
  manageLandingPage();

  // Dashoboard is the default screen which lists all the events created by the user
  manageDashboard();

  manageEventInfo();

  // This will probably be modal window that pops up over the current display
  // Much of the CRUD operations/listeners are in here
  manageEventEditor();

  // There is a section devoted to specific EVENT info.
  // Currently it has not specific listeners

  // This is a modal window that pops up to confirm before a DELETE happens
  manageRemoveConfirm();

  // This allows clicking outside of the sub-menu to close it
  mainClickListener();
}

//////////// Useful Functions /////////////

const mainClickListener = () => {
  $("main")
    .find("section")
    .click(function(event) {
      closeSubMenu();
    });
};

// We have to convert time stamps a bunch.
const convertTimeStampToDate = (timeStamp, mode) => {
  let absoluteTime = new Date(timeStamp);
  let adjustedTime = new Date(
    timeStamp - absoluteTime.getTimezoneOffset() * 60000
  );

  // to work with jquery formatting we have to make numbers less than 10 two digits by adding a zero
  const addZero = number => {
    if (number < 10) {
      return `0${number}`;
    } else {
      return number;
    }
  };

  let dateObject = {
    year: adjustedTime.getUTCFullYear(),
    month: addZero(adjustedTime.getUTCMonth() + 1),
    day: addZero(adjustedTime.getUTCDate()),
    hour: addZero(adjustedTime.getUTCHours()),
    minutes: addZero(adjustedTime.getUTCMinutes())
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
function hideAll() {
  $("section").attr("hidden", true);
}

/////////////////// NAV BAR ///////////////////////

const manageNav = () => {
  // If you're on the Landing page, this will remove the Login/Signup Interface
  // if you're logged in it will bring you to the dashboard
  logoClickListener();
  //This will remove the JWT and clear the state
  // and return the user to the landing page
  logOutListener();
  // this returns the user to the events dashboard
  navEventLinkListener();
  // This toggles the mobile sub-menu
  subMenuToggleListener();
};

const logoClickListener = () => {
  $("#nav-logo").click(function(event) {
    event.preventDefault();
    if (STATE.token) {
      openDashboard();
    } else {
      hideAll();
      clearLandingInputs();
      $("#landing").removeAttr("hidden");
    }
  });
};
const logOutListener = () => {
  $(`#nav-log-out`).click(function(event) {
    event.preventDefault();
    STATE.token = "";
    localStorage.setItem("token", "");
    hideAll();
    $("#landing").removeAttr("hidden");
    removeAuthNav();
    closeSubMenu();
    landingPageImageCycler();
  });
};

// On the Auth nav this opens the event dashboard
const navEventLinkListener = () => {
  $("#nav-events").click(function(event) {
    event.preventDefault();
    closeSubMenu();
    openDashboard();
  });
};

const subMenuToggleListener = () => {
  $("#nav-sub-menu-toggle").click(function(event) {
    event.preventDefault();
    if ($("#nav-sub-menu").attr("hidden")) {
      $("#nav-sub-menu").removeAttr("hidden");
    } else {
      closeSubMenu();
    }
  });
};

const closeSubMenu = () => {
  $("#nav-sub-menu").attr("hidden", true);
};

// After they're authorized they get a different nav bar
function switchToAuthNav() {
  $("#nav-auth-no").attr("hidden", true);
  $("#nav-auth-yes").removeAttr("hidden");
}

// On logout we switch back to the default nav bar
const removeAuthNav = () => {
  $("#nav-auth-yes").attr("hidden", true);
  $("#nav-auth-no").removeAttr("hidden");
};

//// end NAV BAR ////

//////////////// LANDING (signup-Login) //////////////////////
const manageLandingPage = () => {
  landingPageImageCycler(); // Cycles through images of who uses the app
  signUpSubmitListener(); // Submits the Sign Up Form
  openSignUpInterfaceListener(); // Navigates to singup interface
  logInSubmitListener(); // Submits the login form
  openLogInInterfaceListener(); // Navigates to login interface
};

const landingPageImageCycler = (lastIndex = 0) => {
  setTimeout(() => {
    if (!$("#landing").attr("hidden")) {
      let imageArray = $("#landing-users-images").children();
      let nextIndex = (lastIndex + 1) % imageArray.length;
      $(imageArray[lastIndex]).attr("hidden", true);
      $(imageArray[nextIndex]).removeAttr("hidden");
      landingPageImageCycler(nextIndex);
    }
  }, 3000);
};

// Once a form is submitted we clear all the values
const clearLandingInputs = () =>
  $("#auth")
    .find("input")
    .val("");

/// Sign Up Start ///
// These two functions are used by other sections of the app to navigate to SignUp
const openSignUpInterfaceListener = () => {
  $("#nav-sign-up, #sign-up-button, #sign-up-instead").click(function(event) {
    event.preventDefault();
    closeSubMenu();
    $("#auth, #auth-signup").removeAttr("hidden");
    // If the auth interface becomes a modal window I won't need to hide the landing
    $("#auth-login").attr("hidden", true);
  });
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
///  Sign Up end ///

///  Log In Start ///
// These functions are used by other parts of the app to navigate to the login interface
const openLogInInterfaceListener = () => {
  $("#log-in-button, #nav-log-in, #log-in-instead").click(function(event) {
    event.preventDefault();
    closeSubMenu();
    $("#auth, #auth-login").removeAttr("hidden");
    // If the auth interface becomes a modal window I won't need to hide the landing
    $("#auth-signup").attr("hidden", true);
  });
};

// Login specific functions
const logInSubmitListener = () => {
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
      $("#landing-users-images")
        .children()
        .attr("hidden", true);
    })
    .catch(err => {
      console.log(err);
      $("#login-error").html("Incorrect Email or Password");
    });
}

//// end LANDING PAGE ////

////////////////////// DASHBOARD //////////////////////
const manageDashboard = () => {
  // This will open Event info for a specific event
  eventInfoLinkListener();
  // This will open the URL/HTML form associated with a specific event
  eventLiveFormLinkListener();
};

// Listeners
// These are used on the dashboard as well as on specific event info pages.

const eventInfoLinkListener = () => {
  $("#dash").on("click", ".js-event-info-link", function(event) {
    event.preventDefault();
    // Need some what to store the data so we can make the correct API request based upon the link for now we'll leave a place holder
    let eventId = $(this)
      .parents(".dash-event")
      .attr("data-id");

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
function openDashboard() {
  hideAll();
  // This makes sure to remove any specific event that was being looked at
  // so that if a new event is created you don't edit your old event instead.
  STATE.focusEventId = 0;
  // This takes the hostId (Which will so be stored in the JWT)
  // and grabs all associated events from that host
  $.ajax({
    headers: { Authorization: `Bearer ${STATE.token}` },
    url: `/api/events/`,
    type: "GET",
    contentType: "application/json"
  })
    .then(res => populateDashboard(res))
    .catch(err => console.log(err));

  $("#dash").removeAttr("hidden");
}

const populateDashboard = res => {
  let now = Date.now();
  // Events are sorted by whether or not they're complete or not
  populateEvents(res.filter(event => event.endTimeStamp > now), "Upcoming");
  populateEvents(res.filter(event => event.endTimeStamp < now), "Complete");
};

const populateEvents = (events, type) => {
  let allEvents = events.map(event => eventTemplate(event, type.toLowerCase()));

  $(`#dash-${type.toLowerCase()}`).html(
    `<h2>${type} Events</h2>` + allEvents.join("")
  );

  let elementsToHide =
    type.toLowerCase() === "upcoming"
      ? ".event-feedback-link"
      : ".event-edit-button, .upcoming-info";

  $(`#dash-${type.toLowerCase()}`)
    .find(elementsToHide)
    .attr("hidden", true);
};

const eventTemplate = (event, type) => {
  return `
    <div class="dash-event ${type}" data-id="${event.eventId}">
      <h3><a class="event-title js-event-info-link" href="15">${
        event.title
      }</a></h3>
      <div>${convertTimeStampToDate(event.endTimeStamp)}</div>
      <div class="upcoming-info">
        <div><span class="preface">Event Code: </span>${event.code}</div>
        <div>
          <span class="preface">Event Phone: </span>${event.phone}
        </div>;
        <div class="live-form-link-holder">
          <div class="preface">Link to live form - </div>
          <div class="live-form-link-url"><a id="${
            event.code
          }" class="live-form-link" href="URL">${window.location.href +
    event.code}</a></div>
        </div>
      </div>
      <div><a class="event-feedback-link js-event-info-link" href="URL">Feedback Info</a></div>
      <div class="dash-icon-holder">
        <a class="event-remove-button" href="None"><img src="./assets/TrashIcon.png" alt="remove ${
          event.title
        }"></a>
        <a class="event-edit-button" href="None"><img src="./assets/EditIcon.png" alt="edit ${
          event.title
        }"></a>
        <a class="event-feedback-link js-event-info-link" href="None"><img src="./assets/LookIcon.png" alt="feedback for ${
          event.title
        }"></a>
      </div>
    </div>
  `;
};

/// end DASHBOARD ///

/////////////////// EVENT INFO STUFF ///////////////////

const manageEventInfo = () => {
  backButtonListener();
};

const backButtonListener = () => {
  $("#info-back-button").click(function(event) {
    event.preventDefault();
    openDashboard();
  });
};

const openEventInfo = eventId => {
  hideAll();
  // This takes the Event id and makes that event the focused event.
  STATE.focusEventId = eventId;
  // Make a request for the info on this particular event using the id

  $.ajax({
    headers: { Authorization: `Bearer ${STATE.token}` },
    url: `/api/events/${eventId}`,
    type: "GET",
    contentType: "application/json"
  })
    .then(res => populateEventInfo(res))
    .catch(err => console.log(err));

  $("#info").removeAttr("hidden");
};

const populateEventInfo = res => {
  populateEventDetails(res);
  // If the event endTimeStamp is in the past will remove the instructions
  if (res.endTimeStamp > Date.now()) {
    populateEventInstructions(res);
    $("#info-details")
      .find(".event-edit-button")
      .removeAttr("hidden");
    $("#details-end").html(
      "<span class='preface'>Event ends:<span> " +
        convertTimeStampToDate(res.endTimeStamp)
    );
  } else {
    $("#info-instructions").attr("hidden", true);
    $("#info-details")
      .find(".event-edit-button")
      .attr("hidden", true); // TODO Check if this still works
    $("#details-end").html(
      "<span class='preface'>Event ended:<span> " +
        convertTimeStampToDate(res.endTimeStamp)
    );
  }
};

// This is only displayed if the event hasn't happened
const populateEventInstructions = res => {
  $("#info-instructions").removeAttr("hidden");
  $(".js-instructions-code").html(res.code);
  $(".live-phone").html(res.phone);
  $(".live-form-link-url a").attr("id", res.code);
  $(".live-form-link-url a").html(`${window.location.href + res.code}`);
};

// These things are always displayed
const populateEventDetails = res => {
  $("#details-title").html(res.title);
  $("#details-host").html(res.displayName);
  $("#details-thanks").html(res.thanks);
  populateFeedbackInDepth(res);
};

const populateFeedbackInDepth = res => {
  // GET all the feedback associated with the event.
  $.ajax({
    headers: { Authorization: `Bearer ${STATE.token}` },
    url: `/api/feedback/${res.eventId}`,
    type: "GET",
    contentType: "application/json"
  })
    .then(feedbackarray => {
      if (feedbackarray.length > 0) {
        // This displays all the feedback on the website
        $("#info-graphs").removeAttr("hidden");
        populateDetailGraph(feedbackarray);
        // This will be useful once I have twillio
        // populateSourceGraph(feedbackArray)
        $("#feedback-in-depth").html(
          feedbackarray.map(feedback => feedbackTemplate(feedback))
        );
      } else {
        $("#info-graphs").attr("hidden", true);
        $("#feedback-in-depth").html("No feedback yet");
      }
    })
    .catch(err => console.log(err));
};

const populateDetailGraph = feedbackArray => {
  let total = feedbackArray.length;
  let email = feedbackArray.filter(feedback => feedback.email !== "").length;
  let phone = feedbackArray.filter(feedback => feedback.phone !== "").length;
  let more = feedbackArray.filter(feedback => feedback.preferences.length > 0)
    .length;

  $("#total-number").html(total);
  $("#total-bar").css("height", "80%");
  $("#email-number").html(email);
  $("#email-bar").css("height", `${(email / total) * 80}%`);
  $("#phone-number").html(phone);
  $("#phone-bar").css("height", `${(phone / total) * 80}%`);
  $("#more-number").html(more);
  $("#more-bar").css("height", `${(more / total) * 80}%`);
};

const feedbackTemplate = feedback => {
  // If the person providing feedback opts in to more communication
  // then we display a more in depth display box
  if (feedback.optIn) {
    return `
      <div class="feedback-single">
        <div class="single-date">${convertTimeStampToDate(
          feedback.timeStamp
        )}</div>
        <div class="single-container">
          <div class="attendee-top">
            <div class="attendee-info">
              <div><span class="preface">Name: </span>${feedback.name}</div>
              <div><span class="preface">Email: </span><a href="mailto:${
                feedback.email
              }">${feedback.email}</a></div>
              <div><span class="preface">Phone: </span>${feedback.phone}</div>
            </div>
            <div class="attendee-preferences">
              ${prefeneceTemplate(feedback.preferences).join("")}
            </div>
          </div>
          <h3>Feedback - </h3>
          <p>${feedback.content}</p>
        </div>
      </div>
    `;
  } else {
    return `
        <div class="feedback-single">
          <div class="single-date">${convertTimeStampToDate(
            feedback.timeStamp
          )}</div>
          <div class="single-container">
            <h3>Feedback - </h3>
            <p>${feedback.content}</p>
          </div>
        </div>
      `;
  }
};

const prefeneceTemplate = preferences => {
  if (preferences) {
    return preferences.map(
      preference => `<div class="attendee-preference">${preference}</div>`
    );
  }
};

/// end EVENT INFO ///

/////////////////// EVENT EDITOR /////////////////////

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

// eventEditButtonListener & new EventButtonListenter both open the editor
const eventEditButtonListener = () => {
  $("main").on("click", ".event-edit-button", function(event) {
    event.preventDefault();

    // TODO USE THIS ONE TO FIX DELETE...
    let eventId = $(this)
      .parents(".dash-event")
      .attr("data-id");

    if (eventId) {
      openEventEditor(eventId);
    } else {
      openEventEditor(STATE.focusEventId);
    }
  });
};

const newEventButtonListener = () => {
  $(".js-new-event-button").click(function(event) {
    event.preventDefault();
    openEventEditor();
    closeSubMenu();
  });
};

const openEventEditor = eventId => {
  // The focus event has to updated inorder for Updates to edit the correct file.
  // This will also be doubled up with the JWT
  STATE.focusEventId = eventId;
  let host = jwt_decode(STATE.token).host;

  const defaultEventInfo = {
    title: "My New Event",
    thanks: "Thanks so much for coming to my event!",
    endTimeStamp: Date.now(),
    displayName: host.firstName + " " + host.lastName
  };

  if (eventId) {
    $.ajax({
      headers: { Authorization: `Bearer ${STATE.token}` },
      url: `/api/events/${eventId}`,
      type: "GET",
      contentType: "application/json"
    })
      .then(res => populateEventEditor(res))
      .catch(err => console.log(err));
  } else {
    populateEventEditor(defaultEventInfo);
  }
  $("#edit").removeAttr("hidden");
};

// Editor specifc Functions

const populateEventEditor = eventInfo => {
  $("#edit-title").val(eventInfo.title);
  $("#edit-host").val(eventInfo.displayName);
  let date = convertTimeStampToDate(eventInfo.endTimeStamp, "object");
  $("#edit-date").val(`${date.year}-${date.month}-${date.day}`);
  $("#edit-time").val(`${date.hour}:${date.minutes}`);
  $("#edit-thanks").val(eventInfo.thanks);
};

const eventEditorSubmitButtonListener = () => {
  $("#edit-submit-button").click(function(event) {
    event.preventDefault();

    let endDate = $("#edit-date").val();
    let endTime = $("#edit-time").val();

    let eventInfo = {
      title: $("#edit-title").val(),
      displayName: $("#edit-host").val(),
      endTimeStamp: new Date(endDate + "T" + endTime).getTime(),
      thanks: $("#edit-thanks").val()
    };

    if (STATE.focusEventId) {
      submitEventEdits(eventInfo);
    } else {
      createEvent(eventInfo);
    }
  });
};

const createEvent = eventInfo => {
  $.ajax({
    url: "/api/events/",
    type: "POST",
    headers: { Authorization: `Bearer ${STATE.token}` },
    data: JSON.stringify(eventInfo),
    contentType: "application/json"
  })
    .then(res => {
      STATE.focusEventId = res.eventId;
      openEventInfo(STATE.focusEventId);
      clearEventEditorFields();
    })
    .catch(err => console.log(err));
};

const submitEventEdits = eventInfo => {
  $.ajax({
    url: `/api/events/${STATE.focusEventId}`,
    type: "PUT",
    headers: { Authorization: `Bearer ${STATE.token}` },
    data: JSON.stringify(eventInfo),
    contentType: "application/json"
  })
    .then(() => {
      openEventInfo(STATE.focusEventId);
      clearEventEditorFields();
    })
    .catch(err => console.log(err));
};

const eventEditorCancelButtonListener = () => {
  $("#edit-cancel-button").click(function(event) {
    event.preventDefault();
    if ("new") {
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

/// End EVENT EDITOR ///

//////////////// REMOVE CONFIRM /////////////////////

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
    let removeId = $(this)
      .parents(".dash-event")
      .attr("data-id");
    console.log(removeId);
    if (removeId) {
      STATE.focusEventId = removeId;
      openRemoveConfirm(removeId);
    } else {
      openRemoveConfirm(STATE.focusEventId);
    }
  });
};

const openRemoveConfirm = id => {
  $.ajax({
    headers: { Authorization: `Bearer ${STATE.token}` },
    url: `/api/events/${id}`,
    type: "GET",
    contentType: "application/json"
  })
    .then(res => $("#remove-title").html(res.title))
    .catch(err => console.log(err));
  $("#remove").removeAttr("hidden");
};

const removeConfirmButtonListener = () => {
  $("#confirm-delete-button").click(function(event) {
    event.preventDefault();
    deleteEvent();
  });
};

const deleteEvent = () => {
  $.ajax({
    url: `/api/events/${STATE.focusEventId}`,
    headers: { Authorization: `Bearer ${STATE.token}` },
    type: "DELETE",
    contentType: "application/json"
  })
    .then(() => openDashboard())
    .catch(err => console.log(err));
};

const removeCancleButtonListener = () => {
  $("#cancel-delete-button").click(function(event) {
    event.preventDefault();
    openDashboard();
  });
};

/// end REMOVE CONFIRM ///

$(manageApp());
