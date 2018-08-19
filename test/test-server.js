"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const {EventModel} = require("../events/models");

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const {
  seedDatabase,
  tearDownDb
} = require("./seedDatabase");
const { expect } = chai;

chai.use(chaiHttp);

describe("Server", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    // This is because my local database is slow.
    this.timeout(5000)
    return seedDatabase();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('Root Landing Page', function(){
    it('Should send the html for the website', function(){
      return chai.request(app)
        .get('/')
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.html
        })
    })
  })

  describe("Feedback Landing", function() {
    it("Should send the html for the feedback page", function() {
      return EventModel
        .findOne()
        .then(function(event){
          return chai.request(app)
            .get(`/${event.code}`)
        })
        .then(function(res){
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        })
    })
  })
})
