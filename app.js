const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
var nodemailer = require('nodemailer');
var dayjs = require('dayjs')
const cron = require("node-cron");
const crypto = require('crypto');
//import dayjs from 'dayjs' // ES 2015
dayjs().format()

if(process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

app.use(bodyParser.urlencoded({
  extended: true
}));
const https = require("https");
app.set('view engine', 'ejs');
var _ = require('lodash');
app.use(express.static("public"));
app.use(session({
  secret: "Our Little Secret",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-tannen:Tannen@cluster0-k0mtj.mongodb.net/Main", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.set("useCreateIndex", true);

//Email

var transporter = nodemailer.createTransport({
     host: 'smtpout.secureserver.net', // Office 365 server
     port: 465,     // secure SMTP
     secure: true, // false for TLS - as a boolean not string - but the default is false so just remove this completely
     auth: {
         user: "support@Tut-Tut.org",
         pass: "Tut-Tut123"
     }
 });

 var mailOptions = {
   from: 'support@Tut-Tut.org',
   to: "Tannenhall@yahoo.com",
   subject: 'Tut-Tut Tutoring',
   text: 'TESTINGGGGGG'
 };

 transporter.sendMail(mailOptions, function(error, info) {
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent:');
   }
 });



const userSchema = new mongoose.Schema({
  username: String,
  capitalizedUsername: String,
  password: String,
  age: Number,
  tutor: false,
  accountCreationTime: Date,
  vcLink: String,

  GFname: String,
  GLname: String,
  Phone: String,
  SFname: String,
  SLname: String,
  School: String,

  guid: String


});

const tutorRequestSchema = new mongoose.Schema({
  tutor: String,
  tutorEmail: String,
  tutorID: String,
  availableTime: String,
  requestSendTime: Date,
  startTimestamp: Date,
  subject: String,
  tutorSubject: Array,
  status: String,
  studentId: String,
  grade: Number,
  subTopic: String,
  timeOfAccept: Date,
  note: String,
  importance: Number,
  studentUsername: String,
  studentName: String,
  vcLink: String
});


const TutorRequest = mongoose.model("TutorRequest", tutorRequestSchema);

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});


//Reset Password


//Link from email
app.get("/resetPassword/:guidParam", function(req, res){

  var guidParam = req.params.guidParam;

  User.findOne({guid: guidParam}, function(err, foundUsers){
    console.log("FOUNNDD" + foundUsers);
    if(foundUsers === null){
      res.render("404");
    }else {
      res.render("resetPasswordGuid", {guid: guidParam, failure: ""});
    }
  });
});

app.post("/resetPasswordGuid", function(req, res){

  if(req.body.newPassword === req.body.confirmNewPassword){
    User.findOne({guid: req.body.guid}, function(err, foundUser){
      console.log("//////////" + foundUser);
      foundUser.setPassword(req.body.newPassword, function(){
        foundUser.save();
        User.findOneAndUpdate({guid: req.body.guid}, {guid: ""}, function(err, doc) {return;});
        res.redirect("/login");
      });
    })
  }else{
    res.render("resetPasswordGuid", {failure: "Have both password fields the same", guid: req.body.guid})
  }


});


//One that user goes to first
app.get("/resetPassword", function(req, res){
  res.render("resetPassword", {failure: ""});
});

app.post("/resetPassword", function(req, res){

  User.findOne({username: req.body.email}, function(err, foundEmail){
    if(foundEmail === null){
      console.log("NULLLL");
      res.render("resetPassword", {failure: "Email not found"})
    }else {
      console.log("HAPYYYYY");
      var guid = CreateGuid();

      User.findOneAndUpdate({username: req.body.email}, {guid: guid}, function(err, doc) {
        return;
      });

      console.log("http://localhost:3000/resetPassword/" + guid);
    }
  });

});


function CreateGuid() {
   function _p8(s) {
      var p = (Math.random().toString(16)+"000000000").substr(2,8);
      return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
   }
   return _p8() + _p8(true) + _p8(true) + _p8();
}









//LOGIN LOGOUT

require("./login.js")(app, User, passport);


//Tutor Page


app.get("/tutorRequestsView", function(req, res){

  if(req.isAuthenticated()){
    if(req.user.tutor === true){

      TutorRequest.find({tutorID: req.user._id}).sort({importance: 1 ,startTimestamp: 1}).exec(function(err, yourTutorRequests){

        var tutorRequestsWithCorrectTime = [];

        yourTutorRequests.forEach(function(msg) {
          if (msg.startTimestamp != null) {

            msg = msg.toObject();

            var dateFormatted = dayjs(msg.startTimestamp);
            // console.log(dateFormatted.format('MM/DD/YYYY hh:mmA'));
            msg.startDateString = dateFormatted.format('MM/DD/YYYY')
            time1 = dateFormatted.format('hh:mm')
            time2 = dateFormatted.format('hh:45 A')
            msg.startTimeString = time1 + " - " + time2
            tutorRequestsWithCorrectTime.push(msg)
          }
        });


// TEST

// User.findOne({_id: req.user._id}, function(err, foundUser){
//   console.log("//////////" + foundUser);
//   foundUser.setPassword("123", function(){
//     foundUser.save();
//   });
// })



// TEST

        res.render("tutorView", {yourTutorRequests: tutorRequestsWithCorrectTime});
      });





    }else {
      res.render("tutorsOnly")
    }
  }else {
    res.redirect("/login")
  }

  // console.log(dayjs("12-25-1995", "MM-DD-YYYY").valueOf());

});



app.post("/addTutorTimeSlot", function(req, res){

  if(req.isAuthenticated()){


  var subjectsArray = [];

  if(req.body.Math === "on"){
    subjectsArray.push("Math")
  }
  if(req.body.English === "on"){
    subjectsArray.push("English")
  }
  if(req.body.Science === "on"){
    subjectsArray.push("Science")
  }
  if(req.body.History === "on"){
    subjectsArray.push("History")
  }

  var tutorRequest = new TutorRequest({tutor: req.user.SFname, note: "", vcLink: req.user.vcLink, tutorID: req.user._id, tutorEmail: req.user.username, status: "Available", tutorSubject: subjectsArray, startTimestamp: dayjs(req.body.date + " " + req.body.time, "YYYY-MM-DD HH:mm").valueOf()});

  tutorRequest.save();

  res.redirect("/tutorRequestsView")
}else{
  res.redirect("/login")
}

});





// app.get("/tutorRequestsView", function(req, res) {
//
//   if(req.isAuthenticated()){
//     if(req.user.tutor === true){
//   TutorRequest.find({status: "Pending"}).sort({
//     mssgSendTime: 1
//   }).exec(function(err, foundMsgs) {
//
//     var userIds = [];
//     foundMsgs.forEach(function(msg) {
//       userIds.push(msg.senderUserID);
//     });
//
//     User.find().where('_id').in(userIds).exec(function(err, foundUsers) {
//       var data = [];
//       foundMsgs.forEach(function(msg) {
//         data.push(createPair(msg, foundUsers));
//       });
//
// TutorRequest.find({tutor: req.user.username}).sort({importance:1}).exec(function(err, yourTutorRequests){
//
//
// console.log(yourTutorRequests);
//       res.render("tutorRequestsView", {
//         foundMssgs: data,
//         yourTutorRequests: yourTutorRequests
//       });
//
// });
//     });
//   });
// }else{
//   res.render("tutorsOnly", {});
// }
//   }else{
//     res.redirect("/login");
//   }
// });
//
//
function createPair(msg, userList) {
  var i = 0;
  for (i = 0; i < userList.length; i++) {
    var user = userList[i];
    if (user._id == msg.senderUserID) {
      var pair = {
        msgObj: msg,
        userObj: user
      };
      return pair;
    }
  }
}



app.get("/studentAccountPage", function(req, res) {


  if (req.isAuthenticated()) {
    if(req.user.tutor === false){
      //Check here if there is a value entered into the table for parent name if not then show them second form
      // console.log(req.user._id);

      // TutorRequest.find({ startTimestamp: { $lt: Date.now() }}).exec(function(err, userObj){
      //      console.log(userObj);
      // });

      TutorRequest.find({ $and: [ { startTimestamp: { $gt: Date.now() } }, { status: "Available" } ] }).sort({startTimestamp: 1}).exec(function(err, foundMsgs) {
        TutorRequest.find({studentId: req.user._id}).sort({importance: 1 ,startTimestamp: 1}).exec(function(err, studentsMssgs){


          var mssgsWithCorrectTime = [];

          foundMsgs.forEach(function(msg) {
            if (msg.startTimestamp != null) {

              msg = msg.toObject();

              var dateFormatted = dayjs(msg.startTimestamp);
              // console.log(dateFormatted.format('MM/DD/YYYY hh:mmA'));
              msg.startDateString = dateFormatted.format('MM/DD/YYYY')
              time1 = dateFormatted.format('hh:mm')
              time2 = dateFormatted.format('hh:45 A')
              msg.startTimeString = time1 + " - " + time2
              // msg.startTimeString = dateFormatted.format(time1 + " - " + time2 + ":45" + time4)
              mssgsWithCorrectTime.push(msg)
            }
          });

          var studentMssgsWithCorrectTime = [];

          studentsMssgs.forEach(function(msg) {
            if (msg.startTimestamp != null) {

              msg = msg.toObject();

              var dateFormatted = dayjs(msg.startTimestamp);
              // console.log(dateFormatted.format('MM/DD/YYYY hh:mmA'));
              msg.startDateString = dateFormatted.format('MM/DD/YYYY')
              time1 = dateFormatted.format('hh:mm')
              time2 = dateFormatted.format('hh:45 A')
              msg.startTimeString = time1 + " - " + time2
              studentMssgsWithCorrectTime.push(msg)
            }
          });




          //ADD START DATE STRING AND STARTTIMESTRING AND THEN ADD THIS TO THE TABLE

          res.render("studentAccountPage", {mssgs: mssgsWithCorrectTime, studentsMssgs: studentMssgsWithCorrectTime, username: req.user.username});
        });
        });
    }
    else{
      res.render("tutorsOnly", {});
    }
  }
  else {
    res.redirect("/login");
  }
});

// app.get("/signup2", function(req, res){
//
//   if (req.isAuthenticated()) {
//     Users.findOne({_id: req.user._id}).exec(function(err, foundUser){
//       if(foundUser.guardianName)
//     });
//   };
//
// });




//Request Tutor


require("./requestTutor.js")(app, TutorRequest, passport, transporter, dayjs)


//MORE TutorRequest

app.post("/more", function(req, res) {

  if(req.isAuthenticated()){

  TutorRequest.findOne({
    _id: req.body.id
  }, function(err, foundMsg) {
    User.findOne().where('_id').in(foundMsg.senderUserID).exec(function(err, foundUser) {
      var pair = {
        msgObj: foundMsg,
        userObj: foundUser
      };
      console.log(pair);
      res.render("./more.ejs", {
        pair: pair
      });
    });
  });
}else{
  res.render("/login")
}
});


app.post("/acceptTutor", function(req, res) {

  if(req.isAuthenticated()){

  TutorRequest.findOneAndUpdate({_id: req.body.accept}, {status: "Accepted", tutor: req.user.username, timeAccepted: Date.now(), vcLink: req.body.vcLink, importance: 1}, function(err, doc) {
    return;

  });

res.redirect("tutorRequestsView");

  var mailOptions = {
    from: 'halltannen@gmail.com',
    to: req.user.username,
    subject: 'Tut-Tut Tutoring',
    text: 'Your tutoring request has been accepted!'
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response + req.body.email);
    }
  });
}else{
  res.redirect("/login")
}
});


app.post("/completedTutorRequest", function(req, res){

  if(req.isAuthenticated()){

    TutorRequest.findOneAndUpdate({_id: req.body.id}, {status: "Completed", importance: 2}, function(err, doc) {
      res.redirect("/tutorRequestsView");
    });
  }else{
    res.redirect("/login")
  }

});

app.post("/cancelSession", function(req, res){

  if(req.isAuthenticated()){
  console.log("HEYY");
  TutorRequest.findOneAndUpdate({_id: req.body.msgID}, {status: "Canceled", importance: 3}, function(err, doc) {
    res.redirect("/studentAccountPage");
  });
}else{
  res.redirect("/login")
}
});

app.post("/cancelSessionTutor", function(req, res){

  if(req.isAuthenticated()){
  console.log("HEYY");
  TutorRequest.findOneAndUpdate({_id: req.body.msgID}, {status: "Canceled", importance: 3}, function(err, doc) {
    res.redirect("/tutorRequestsView");
  });
}else{
  res.redirect("/login")
}
});



//404 PAGE

app.get('*', function(req, res){
  res.render("404.ejs", {})
});

//Cron job running to update fields that are completed

let updateCompleted = cron.schedule('* * * * *', () => {
  console.log('running a task every minute');
  TutorRequest.update({ startTimestamp: { $lt: Date.now() }}, {status: "Completed", importance: 2}, {multi: true},function(err, doc){
    console.log(err);
    console.log(doc);
  });
});

updateCompleted.start();


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
