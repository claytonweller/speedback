"use strict";
require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");

const { EventModel } = require("../events/models");
const { Host } = require("../hosts/models");

const { createAuthToken } = require("../auth/router");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const {
  seedDatabase,
  tearDownDb,
  generateEventData,
  preAuthHost
} = require("./seedDatabase");
const { expect } = chai;

chai.use(chaiHttp);

describe("Events", function() {
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

  describe("GET all endpoint", function() {
    it("should return all events associated with a specific host", function() {
      let res;
      return Host.findOne()
        .then(function(host) {
          let authToken = createAuthToken(preAuthHost(host));
          return chai
            .request(app)
            .get(`/api/events/`)
            .set("Authorization", `Bearer ${authToken}`);
        })
        .then(function(_res) {
          res = _res;
          return EventModel.countDocuments();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        });
    });

    it("should return events with the correct fields", function() {
      let resEvent;
      return Host.findOne()
        .then(function(host) {
          let authToken = createAuthToken(preAuthHost(host));
          return chai
            .request(app)
            .get(`/api/events/`)
            .set("Authorization", `Bearer ${authToken}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("array");
          expect(res.body.length).to.be.at.least(1);
          const expectedKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "host",
            "code",
            "phone",
            "displayName",
            "timeStamp",
            "eventId",
            "webFormVisits"
          ];
          res.body.forEach(function(event) {
            expect(event).to.be.a("object");
            expect(event).to.include.keys(expectedKeys);
          });
          resEvent = res.body[0];
          return EventModel.findById(resEvent.eventId);
        })
        .then(function(event) {
          expect(resEvent.eventId).to.equal(String(event._id));
          expect(resEvent.host).to.equal(String(event.host));
          const matchKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "code",
            "phone",
            "displayName",
            "timeStamp"
          ];
          matchKeys.forEach(function(key) {
            expect(resEvent[key]).to.equal(event[key]);
          });
        });
    });
  });

  describe("GET one endpoint (feedback side)", function() {
    it("should return the correct event and associated info", function() {
      let res;
      return EventModel.findOne()
        .then(function(event) {
          return chai.request(app).get(`/api/events/code/${event.code}`);
        })
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          const expectedKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "displayName",
            "code",
            "phone",
            "host",
            "timeStamp",
            "eventId",
            "webFormVisits"
          ];
          expect(res.body).to.include.keys(expectedKeys);
          return EventModel.findById(res.body.eventId);
        })
        .then(function(event) {
          expect(res.body.eventId).to.equal(String(event._id));
          const matchKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "code",
            "phone",
            "displayName",
            "timeStamp"
          ];
          matchKeys.forEach(function(key) {
            expect(res.body[key]).to.equal(event[key]);
          });
          expect(res.body.host).to.equal(String(event.host));
        });
    });
  });

  describe("GET one endpoint (host side)", function() {
    it("should return the correct event and associated info", function() {
      let res;
      let authToken;
      return Host.findOne()
        .then(function(host) {
          authToken = createAuthToken(preAuthHost(host));
          return EventModel.findOne({ hostId: host.hostId });
        })
        .then(function(event) {
          return chai
            .request(app)
            .get(`/api/events/${event._id}`)
            .set("Authorization", "Bearer " + authToken);
        })
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          const expectedKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "host",
            "code",
            "phone",
            "displayName",
            "timeStamp",
            "eventId",
            "webFormVisits"
          ];
          expect(res.body).to.include.keys(expectedKeys);
          return EventModel.findById(res.body.eventId);
        })
        .then(function(event) {
          expect(res.body.eventId).to.equal(String(event._id));
          expect(res.body.host).to.equal(String(event.host));
          const matchKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "code",
            "phone",
            "displayName",
            "timeStamp"
          ];
          matchKeys.forEach(function(key) {
            expect(res.body[key]).to.equal(event[key]);
          });
        });
    });
  });

  describe("POST endpoint", function() {
    it("should add a new event", function() {
      return Host.findOne()
        .then(function(host) {
          const authToken = createAuthToken(preAuthHost(host));
          return chai
            .request(app)
            .post("/api/events/")
            .set("Authorization", `Bearer ${authToken}`)
            .send(generateEventData([host._id]));
        })
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys(
            "title",
            "thanks",
            "endTimeStamp",
            "host",
            "code",
            "phone",
            "displayName",
            "timeStamp",
            "eventId"
          );
          expect(res.body.eventId).to.not.be.null;
          return EventModel.findById(res.body.eventId);
        })
        .then(function(event) {
          expect(event).to.be.a("object");
        });
    });
  });

  describe("PUT endpoint", function() {
    it("should update an event", function() {
      const updateData = {
        title: "NEW TITLE",
        displayName: "NEW NAME!"
      };
      let authToken;
      return Host.findOne()
        .then(function(host) {
          authToken = createAuthToken(preAuthHost(host));
          return EventModel.findOne({ hostId: host.hostId });
        })
        .then(function(event) {
          updateData._id = event._id;
          return chai
            .request(app)
            .put(`/api/events/${updateData._id}`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(updateData);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          const expectedKeys = [
            "title",
            "thanks",
            "endTimeStamp",
            "host",
            "code",
            "phone",
            "displayName",
            "timeStamp",
            "_id"
          ];
          expect(res.body).to.include.keys(expectedKeys);
          Object.keys(updateData).forEach(key => {
            expect(String(updateData[key])).to.equal(String(res.body[key]));
          });
        });
    });
  });

  describe("DELETE endpoint", function() {
    it("should delete an event", function() {
      let event;
      let authToken;
      return Host.findOne()
        .then(function(host) {
          authToken = createAuthToken(preAuthHost(host));
          return EventModel.findOne({ hostId: host.hostId });
        })
        .then(function(_event) {
          event = _event;
          return chai
            .request(app)
            .delete(`/api/events/${event._id}`)
            .set(`Authorization`, `Bearer ${authToken}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return EventModel.findById(event._id);
        })
        .then(function(_event) {
          expect(_event).to.be.null;
        });
    });
  });
});
