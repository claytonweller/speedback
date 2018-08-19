"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const {EventModel} = require("../events/models");
const {Feedback} = require("../feedback/models");
const {Host} = require('../hosts/models')

const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");
const {
  seedDatabase,
  tearDownDb,
} = require("./seedDatabase");
const { expect } = chai;

chai.use(chaiHttp);

describe("Events", function() {
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

  describe('GET all endpoint', function(){
    it('should return all events associated with a specific host', function(){
      let res
      return Host.findOne()
        .then(function(host){
          return chai.request(app)
            .get(`/events/?hostId=${host._id}`)
        })
        .then(function(_res){
          res = _res
          return EventModel.countDocuments()
        })
        .then(function(count){
          expect(res.body).to.have.lengthOf(count)
        })
    })

    it('should return events with the correct fields', function(){
      let resEvent
      return Host.findOne()
        .then(function(host){
          return chai.request(app)
            .get(`/events/?hostId=${host._id}`)
        })
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('array')
          expect(res.body.length).to.be.at.least(1)
          const expectedKeys = ['title', 'thanks', 'endTimeStamp', 'host', 'code', 'phone', 'hostId', 'timeStamp', 'eventId']
          res.body.forEach(function(event){
            expect(event).to.be.a('object')
            expect(event).to.include.keys(expectedKeys)
          })
          resEvent= res.body[0]
          return EventModel.findById(resEvent.eventId)
        })
        .then(function(event){
          expect(resEvent.eventId).to.equal(String(event._id))
          const matchKeys = ['title', 'thanks', 'endTimeStamp', 'host', 'code', 'phone', 'hostId', 'timeStamp']
          matchKeys.forEach(function(key){
            expect(resEvent[key]).to.equal(event[key])
          })
        })
    })
  })

  describe('GET one endpoint', function(){
    it('should return the correct event and associated info', function(){
      let res
      return EventModel
        .findOne()
        .then(function(event){
          return chai.request(app)
            .get(`/events/${event._id}`)
        })
        .then(function(_res){
          res = _res
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('object')
          const expectedKeys = ['title', 'thanks', 'endTimeStamp', 'host', 'code', 'phone', 'hostId', 'timeStamp', 'eventId']
          expect(res.body).to.include.keys(expectedKeys)
          return EventModel.findById(res.body.eventId)
        })
        .then(function(event){
          expect(res.body.eventId).to.equal(String(event._id))
          const matchKeys = ['title', 'thanks', 'endTimeStamp', 'host', 'code', 'phone', 'hostId', 'timeStamp']
          matchKeys.forEach(function(key){
            expect(res.body[key]).to.equal(event[key])
          })
        })
    })
  })

  describe("POST endpoint", function() {
    it("should add a new event", function() {
      return Host.findOne()
        .then(function(host){
          return chai
            .request(app)
            .post('/events/')
            .send({hostId:host._id})
        })
        .then(function(res){
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys('title', 'thanks', 'endTimeStamp', 'host', 'code', 'phone', 'hostId', 'timeStamp', 'eventId')
          expect(res.body.eventId).to.not.be.null
          return EventModel.findById(res.body.eventId)
        })
        .then(function(event){
          expect(event).to.be.a('object')
        })
    });
  });

  describe('PUT endpoint', function(){
    it("should update an event", function(){
      const updateData = {
        title:'NEW TITLE',
        host:'NEW HOST'
      }
      return EventModel
        .findOne()
        .then(function(event){
          updateData['_id'] = event._id
          return chai.request(app)
            .put(`/events/${updateData._id}`)
            .send(updateData)
        })
        .then(function(res){
          expect(res).to.have.status(200)
          expect(res).to.be.json
          expect(res.body).to.be.a('object')
          const expectedKeys = ['title', 'thanks', 'endTimeStamp', 'host', 'code', 'phone', 'hostId', 'timeStamp', '_id']
          expect(res.body).to.include.keys(expectedKeys)
        })
    })
  })

  describe('DELETE endpoint', function(){
    it('should delete an event', function(){
      let event
      return EventModel
        .findOne()
        .then(function(_event){
          event = _event
          return chai.request(app)
            .delete(`/events/${event._id}`)
        })
        .then(function(res){
          expect(res).to.have.status(204)
          return EventModel.findById(event._id)
        })
        .then(function(_event){
          expect(_event).to.be.null
        })
    })  
  })
});
