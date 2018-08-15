const mongoose = require("mongoose");
const faker = require("faker");

const {EventModel} = require("../events/models");
const {Host} = require("../hosts/models");
const {Feedback} = require("../feedback/models");

function returnRandomIndex(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function seedDatabase() {
  return new Promise((resolve, reject) => {
    seedHostData()
      .then(hosts => {
        console.log(hosts.length);
        let hostIdArray = hosts.map(host => host._id);
        return seedEventData(hostIdArray);
      })
      .then(events => {
        console.log(events.length);
        let eventIdArray = events.map(event => event._id);

        return seedFeedbackData(eventIdArray);
      })
      .then(feedback => {
        console.log(feedback.length);
        resolve(feedback);
      })
      .catch(err => reject(err));
  });
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleteing test database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

//HOST seed

function seedHostData() {
  return new Promise((resolve, reject) => {
    const seedData = [];
    for (let i = 1; i <= 1; i++) {
      seedData.push(generateHostData());
    }
    Host.insertMany(seedData)
      .then(res => resolve(res))
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

function generateHostData() {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  };
}

// EVENT seed

function seedEventData(hostIdArray) {
  return new Promise((resolve, reject) => {
    const seedData = [];
    for (let i = 1; i <= 3; i++) {
      seedData.push(generateEventData(hostIdArray));
    }
    EventModel.insertMany(seedData)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

function generateEventData(hostIdArray) {
  return {
    title: faker.lorem.word(),
    thanks: faker.lorem.sentence(),
    endTimeStamp: Date.now() - 10000 + Math.floor(Math.random() * 20000),
    host: faker.name.firstName(),
    code: Math.floor(Math.random() * 10000).toString(),
    phone: "303-803-4589",
    hostId: returnRandomIndex(hostIdArray),
    timeStamp: Date.now()
  };
}

// FEEDBACK Seed

function seedFeedbackData(eventIdArray) {
  return new Promise((resolve, reject) => {
    const seedData = [];
    for (let i = 1; i <= 5; i++) {
      seedData.push(generateFeedbackData(eventIdArray));
    }
    Feedback.insertMany(seedData)
      .then(res => resolve(res))
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
}

function generateFeedbackData(eventIdArray) {
  return {
    content: faker.lorem.paragraph(1),
    optIn: faker.random.boolean(),
    name: faker.name.firstName(),
    email: faker.internet.email(),
    phone: "234234",
    updates: faker.random.boolean(),
    feedback: faker.random.boolean(),
    volunteer: faker.random.boolean(),
    timeStamp: Date.now(),
    eventId: returnRandomIndex(eventIdArray),
    didAnything: faker.random.boolean()
  };
}

module.exports = {
  seedDatabase,
  tearDownDb,
  generateEventData,
  generateFeedbackData,
  generateHostData
};
