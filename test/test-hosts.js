"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { Host } = require("../hosts/models");

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

  describe("POST endpoint", function() {
    it("should add a new Host", function() {
      const newHost = generateHostData();
      return chai
        .request(app)
        .post("/api/hosts")
        .send(newHost)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys("hostId", "firstName", "lastName");
          expect(res.body.hostId).to.not.be.null;
          expect(res.body.firstName).to.equal(newHost.firstName);
          expect(res.body.lastName).to.equal(newHost.lastName);
          return Host.findById(res.body.hostId);
        })
        .then(function(host) {
          expect(host.firstName).to.equal(newHost.firstName);
          expect(host.lastName).to.equal(newHost.lastName);
          expect(host.email).to.equal(newHost.email.toLowerCase());
          expect(host.password).to.not.equal(newHost.password);
        });
    });
  });
});
