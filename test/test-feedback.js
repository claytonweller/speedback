"use strict";

require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");

const { EventModel } = require("../events/models");
const { Host } = require("../hosts/models");
const { Feedback } = require("../feedback/models");

const { createAuthToken } = require("../auth/router");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { seedDatabase, tearDownDb, preAuthHost } = require("./seedDatabase");
const { expect } = chai;

chai.use(chaiHttp);

describe("Feedback", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    // This is because my local database is slow.
    this.timeout(5000);
    return seedDatabase();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  // describe("Feedback Web-form Visit POST", function() {
  //   it("should create a new timestamp in the appropriate event", function() {
  //     let event;
  //     EventModel.findOne()
  //       .then(function(_event) {
  //         event = _event;
  //         return chai.request(app).post(`/api/feedback/visited/${event._id}`);
  //       })
  //       .then(function(res) {
  //         console.log("IN VISITED TEST", res);
  //         return EventModel.findById(event._id);
  //       })
  //       .then(function(_event) {
  //         expect(event.webFormVisits.length).to.equal(
  //           _event.webFormVisits.length + 1
  //         );
  //         expect(_event.webFormVisits[0]).to.be.a("number");
  //       })
  //       .catch(function(err) {
  //         console.log(err);
  //       });
  //   });
  // });

  describe("GET endpoint", function() {
    it("should return all feedback associated with a specific event", function() {
      let res;
      let authToken;
      return Host.findOne()
        .then(function(host) {
          authToken = createAuthToken(preAuthHost(host));
          return EventModel.findOne({ host: host._id });
        })
        .then(function(event) {
          return chai
            .request(app)
            .get(`/api/feedback/${event._id}`)
            .set(`Authorization`, `Bearer ${authToken}`);
        })
        .then(function(_res) {
          res = _res;
          return Feedback.countDocuments({ eventId: res.body[0].eventId });
        })
        .then(function(count) {
          expect(res.body.length).to.equal(count);
        });
    });

    it("should return feedback with the right fields", function() {
      let resFeedback;
      let authToken;
      return Host.findOne()
        .then(function(host) {
          authToken = createAuthToken(preAuthHost(host));
          return EventModel.findOne({ hostId: host.hostId });
        })
        .then(function(event) {
          return chai
            .request(app)
            .get(`/api/feedback/${event._id}`)
            .set(`Authorization`, `Bearer ${authToken}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.be.at.least(1);
          const expectedKeys = [
            "content",
            "optIn",
            "name",
            "email",
            "phone",
            "timeStamp",
            "preferences",
            "eventId"
          ];
          res.body.forEach(function(feedback) {
            expect(feedback).to.be.a("object");
            expect(feedback).to.include.keys(expectedKeys);
          });
          resFeedback = res.body[0];
          return Feedback.findById(resFeedback.id);
        })
        .then(function(feedback) {
          const matchKeys = [
            "content",
            "optIn",
            "name",
            "email",
            "phone",
            "timeStamp",
            "eventId"
          ];
          matchKeys.forEach(function(key) {
            expect(resFeedback[key]).to.equal(feedback[key]);
          });
        });
    });
  });

  describe("POST endpoint", function() {
    it("should add new feedback", function() {
      return EventModel.findOne()
        .then(function(event) {
          return chai.request(app).post(`/api/feedback/${event.code}`);
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys(
            "content",
            "optIn",
            "name",
            "email",
            "phone",
            "updates",
            "feedback",
            "volunteer",
            "_id",
            "timeStamp",
            "eventId"
          );
          expect(res.body._id).to.not.be.null;
          return Feedback.findById(res.body._id);
        })
        .then(function(feedback) {
          expect(feedback).to.be.a("object");
        });
    });
  });

  describe("PUT endpoint", function() {
    it("should update a feedback document", function() {
      const updateData = {
        optIn: true,
        content: "asfsdfjsaldkfjas;lkjfsdlkfja;lksdjf;alksjdf"
      };
      return Feedback.findOne()
        .then(function(feedback) {
          updateData["_id"] = feedback._id;
          return chai
            .request(app)
            .put(`/api/feedback/${updateData._id}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          const expectedKeys = [
            "content",
            "optIn",
            "name",
            "email",
            "phone",
            "updates",
            "feedback",
            "volunteer",
            "_id",
            "timeStamp",
            "eventId"
          ];
          expect(res.body).to.include.keys(expectedKeys);
        });
    });
  });
});
