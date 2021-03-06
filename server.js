require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
// const cors = require("cors");

mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require("./config");
const app = express();

const { router: eventsRouter } = require("./events");
const { router: hostsRouter } = require("./hosts");
const { router: feedbackRouter } = require("./feedback");
const { router: authRouter, localStrategy, jwtStrategy } = require("./auth");
const { router: twilioRouter } = require("./twilio/router");

// const corsOptions = {
//   origin: 'http://twilio.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors());

app.use(express.static("public"));
app.use(morgan("common"));
app.use("/api/events", eventsRouter);
app.use("/api/hosts", hostsRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/auth", authRouter);
app.use("/api/twilio", twilioRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

// This Request is for the URL feedback page. It takes a unique event code,
// and populates the feedback form from a GET Event call
app.get("/:eventCode", (req, res) => {
  res.sendFile("public/feedback.html", { root: __dirname });
});

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true },
      err => {
        if (err) {
          return reject(err);
        }

        server = app
          .listen(port, () => {
            console.log("App is Listening on Port " + port);
            resolve();
          })
          .on("error", err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

const closeServer = () => {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing Server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
};

if (require.main === module) {
  runServer(DATABASE_URL, PORT).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
