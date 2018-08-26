"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { Host } = require("../hosts/models");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const { seedDatabase, tearDownDb } = require("./seedDatabase");
const { expect } = chai;

chai.use(chaiHttp);

describe("Auth", function() {
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

  describe("Login - Local Auth", function() {
    it("Should create a valid auth token", function() {
      let password = "123password";
      let testHost = {
        email: "email@gmail.com",
        firstName: "Fake",
        lastName: "Person"
      };
      return Host.hashPassword(password)
        .then(function(hash) {
          testHost.password = hash;
          return Host.create(testHost);
        })
        .then(function(host) {
          return chai
            .request(app)
            .post("/api/auth/login")
            .send({ email: host.email, password: password });
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.keys("hostId", "authToken");
          return chai
            .request(app)
            .get("/api/events/")
            .set("Authorization", `Bearer ${res.body.authToken}`);
        })
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
        });
    });
  });
});
