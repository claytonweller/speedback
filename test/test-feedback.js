"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { EventModel } = require("../events/models");
const { Feedback } = require("../feedback/models");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { seedDatabase, tearDownDb } = require("./seedDatabase");
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

  describe("GET endpoint", function() {
    it("should return all feedback associated with a specific event", function() {
      let res;
      return EventModel.findOne()
        .then(function(event) {
          return chai.request(app).get(`/feedback/${event._id}`);
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

      return EventModel.findOne()
        .then(function(event) {
          return chai.request(app).get(`/feedback/${event._id}`);
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
            "updates",
            "feedback",
            "volunteer",
            "didAnything",
            "_id",
            "timeStamp",
            "eventId"
          ];
          res.body.forEach(function(feedback) {
            expect(feedback).to.be.a("object");
            expect(feedback).to.include.keys(expectedKeys);
          });
          resFeedback = res.body[0];
          return Feedback.findById(resFeedback._id);
        })
        .then(function(feedback) {
          const matchKeys = [
            "content",
            "optIn",
            "name",
            "email",
            "phone",
            "updates",
            "feedback",
            "volunteer",
            "didAnything",
            "timeStamp",
            "eventId"
          ];
          expect(resFeedback._id).to.equal(String(feedback._id));
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
