"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const Host = require("../hosts/models");
const EventModel = require("../events/models");
const Feedback = require("../feedback/models");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const {
  seedDatabase,
  tearDownDb,
  generateHostData
} = require("./seedDatabase");
const { expect } = chai;

chai.use(chaiHttp);

describe("Hosts", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedDatabase();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  // Begin Post tests
  describe("POST endpoint", function() {
    it("should add a new Host", function() {
      console.log("anything");
      const newHost = generateHostData();
      return chai
        .request(app)
        .post("/hosts")
        .send(newHost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("hostId", "firstName", "lastName");
          expect(res.body.hostId).to.not.be.null;
          expect(res.body.firstName).to.equal(newHost.firstName);
          expect(res.body.lastName).to.equal(newHost.lastName);
          // return Host.findById(res.body.hostId)
        });
    });
  });
});
