const express = require("express");
const router = express.Router();
const passport = require("passport");

const { EventModel } = require("./models");
const { Host } = require("../hosts/models");
const { jwtStrategy } = require("../auth");

router.use(express.json());
passport.use(jwtStrategy);
const jwtAuth = passport.authenticate("jwt", { session: false });

// router.get('/',
//   (req, res, next) => {
//     console.log(req.headers)
//     passport.authenticate('jwt', (err, info, user) =>{
//       console.log('err', err)
//       console.log('info', info)
//       console.log('user', user)
//       if(err){
//         console.log('err')
//         return res.status(401).send(err)
//       } else if(!user){
//         console.log('!user')
//         return res.status(401).send(info)
//       }else {
//         console.log('next')
//         next()
//       }
//       console.log('after')
//       return res.status(401).send(info)
//     })(req, res);
//   },
//   (req, res) =>{
//     console.log(req.user)

//   }
// )

router.get("/", jwtAuth, (req, res) => {
  console.log(req.user);

  return EventModel.find({ host: req.user.id })
    .then(events => {
      let serializedEvents = events.map(event => event.serialize());
      res.status(200).json(serializedEvents);
    })
    .catch(err => {
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

// router.get('/', (req, res) =>{
//   console.log(req.query)
//   EventModel.find({host:req.query.hostId})
//   .then(events => res.status(200).json(events.map(event => event.serialize())))
//   .catch(err => res.status(500).json({message:'Something went wrong on the server'}))
// })

router.get("/code/:eventCode", (req, res) => {
  EventModel.findOne({ code: req.params.eventCode })
    .then(event => {
      res.status(200).json(event.serialize());
    })
    .catch(err => {
      res.status(500).json({ message: "Something went wrong on the server" });
    });
});

router.get("/:eventId", (req, res) => {
  EventModel.findById(req.params.eventId)
    .then(event => res.status(200).json(event.serialize()))
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

const generateEventCode = length => {
  let alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  ];
  let code = "";
  for (let index = 0; index < length; index++) {
    code = code + alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};

router.post("/", (req, res) => {
  let eventInfo = {
    title: req.body.title,
    thanks: req.body.thanks,
    endTimeStamp: req.body.endTimeStamp,
    // TODO UTC ? FIX
    timeStamp: Date.now(),
    phone: "1234567890",
    webFormVisits: [],
    code: generateEventCode(3),
    displayName: req.body.displayName
    // TODO Auth token
    // host: req.user.id
  };
  // TODO LOOP generate eventcode promise loop
  EventModel.find({ code: eventInfo.code })
    .countDocuments()
    .then(count => {
      if (count) {
        // with 4 digits there are nearly half a million combinations
        eventInfo.code = generateEventCode(3);
      }
      return eventInfo;
    })
    .then(event => EventModel.create(event))
    .then(event => {
      res.status(201).json(event.serialize());
    });

  // Host.findById(req.body.hostId)
  //   .then(host => {
  //     eventInfo.host = host._id
  //     return EventModel.find({code:eventInfo.code}).countDocuments()
  //   })
  //   .then(count => {
  //     if(count){
  //       // with 4 digits there are nearly half a million combinations
  //       eventInfo['code'] = generateEventCode(4)
  //     }
  //     return eventInfo
  //   })
  //   .then(event => EventModel.create(event))
  //   .then(event => {
  //     res.status(201).json(event.serialize())
  //   })
});

router.put(
  "/:eventId",
  /*jwtAuth,*/ (req, res) => {
    // check if req.user.id == matches the post's host
    // if matches, let them update
    let toUpdate = {};
    const okToUpdate = ["title", "thanks", "endTimeStamp", "displayName"];

    okToUpdate.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
    EventModel.findByIdAndUpdate(req.params.eventId, { $set: toUpdate })
      .then(event => EventModel.findById(event._id))
      .then(updatedEvent => res.status(200).json(updatedEvent))
      .catch(err =>
        res.status(500).json({ message: "Something went wrong on the server" })
      );
  }
);

router.delete("/:eventId", (req, res) => {
  console.log("Deleted event " + req.params.eventId);
  EventModel.findByIdAndRemove(req.params.eventId)
    .then(event => res.sendStatus(204).end())
    .catch(err =>
      res.status(500).json({ message: "Something went wrong on the server" })
    );
});

module.exports = { router };
