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
const querystring = require('querystring');
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

// query for all emails db.users.find({tutor:true},{username:1,_id:0})

mongoose.connect("mongodb+srv://admin-tannen:Tannen@cluster0-k0mtj.mongodb.net/Main", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.set("useCreateIndex", true);

//Email

var transporter = nodemailer.createTransport({
     service: 'gmail',// false for TLS - as a boolean not string - but the default is false so just remove this completely
     auth: {
         user: "support@tut-tut.org",
         pass: "Bentley1@"
     }
 });

 // var transporter = nodemailer.createTransport({
 //      host: 'smtpout.secureserver.net', // Office 365 server
 //      port: 465,     // secure SMTP
 //      secure: true, // false for TLS - as a boolean not string - but the default is false so just remove this completely
 //      auth: {
 //          user: "support@Tut-Tut.org",
 //          pass: "Tut-Tut123"
 //      }
 //  });



const userSchema = new mongoose.Schema({
  username: String,
  capitalizedUsername: String,
  password: String,
  age: Number,
  tutor: false,
  accountCreationTime: Date,
  vcLink: String,
  language: String,
  GFname: String,
  GLname: String,
  Phone: String,
  SFname: String,
  SLname: String,
  School: String,
  Address: String,
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
  language: String,
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
  vcLink: String,
  sentReminderEmail: String,
  sessionGroupId: String
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
      res.render("resetPassword", {failure: "Email not found (email is case sensitive)"})
    }else {
      console.log("HAPYYYYY");
      var guid = CreateGuid();

      User.findOneAndUpdate({username: req.body.email}, {guid: guid}, function(err, doc) {
        return;
      });

      console.log("http://localhost:3000/resetPassword/" + guid);

      mailHTML = "<p>Hello!</p><p>To reset your Tut-Tut account password click on the following link. Please note that the link will expire in 48 hours. </p>"+ "<p> https://www.tut-tut.org/resetPassword/"+guid+"</p>" + "</a>"+"<p>Thank you,<br>Tut-Tut</p>"

      var mailOptions = {
        from: 'support@tut-tut.org',
        to: req.body.email,
        subject: 'Tut-Tut Reset Password',
        html: mailHTML
        // text: 'Reset Password: ' + "https://tut-tut.org/resetPassword/" + guid
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + req.body.email);
        }
      });
      res.sendFile(__dirname + "/views/sentEmailSuccess.html");
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




app.get("/becomeATutor", function(req, res){
  res.render("becomeATutor");
});

app.get("/TOS-PrivacyPolicy", function(req, res){
  res.render("TOS-PrivacyPolicy");
})


app.post("/addAddress", function(req, res){
  console.log(req.body.address);
  console.log(req.body.id);
  User.findOneAndUpdate({_id: req.user._id}, {Address: req.body.address}, function(err, doc) {
    res.redirect("/tutorRequestsView");
  });
});

//LOGIN LOGOUT

require("./login.js")(app, User, passport);


//Tutor Page


app.get("/tutorRequestsView", function(req, res){

  if(req.isAuthenticated()){
    if(req.user.tutor === true){

      TutorRequest.find({tutorID: req.user._id}).sort({importance: 1 ,startTimestamp: 1}).exec(function(err, yourTutorRequests){
        TutorRequest.countDocuments({tutorID: req.user._id, studentUsername: {$ne : null}}).exec(function(err, completedSessions){
          User.findOne({_id: req.user._id},{_id:0,accountCreationTime:0}).exec(function(err, userObjectM){

        var hasAddress = false;

        if(userObjectM.Address !== undefined){
          console.log("NOTTTTT UNDEFINED");
          hasAddress = true;
        }


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

        res.render("tutorView", {yourTutorRequests: tutorRequestsWithCorrectTime, completedSessions: completedSessions, hasAddress:hasAddress});
      });
      });
      });





    }else {
      res.render("tutorsOnly")
    }
  }else {
    res.redirect("/login")
  }

  // console.log(dayjs("12-25-1995", "MM-DD-YYYY").valueOf());

});


app.post("/groupSessionAccept", function(req, res){
  console.log("Worked");
  console.log(req.body.username);
  User.findOne({username: req.body.username}).exec(function(err, foundUser){
    var tutorRequest = new TutorRequest({tutor: "Jane", note: "", sentReminderEmail: 'false', vcLink: "https://us04web.zoom.us/j/6497578329?pwd=T0RXeWxtWVRiRXJ6b3VjRmNSZWo0dz09", language: "English", tutorID: "5fa3888f76091c000444aefc", tutorEmail: "jane.grumann2023@gmail.com", status: "Booked", startTimestamp: dayjs("2021-06-30-12", "YYYY-MM-DD-H").valueOf(), grade: foundUser.age, importance: 1, studentId: foundUser._id, studentName: foundUser.SFname, studentUsername: foundUser.username, subTopic: "Group Session", subject: "Art"});
    tutorRequest.save();
  });
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

  var timeInput = Number(req.body.time);
  var endTimeInput = Number(req.body.endTime)

  if(timeInput < 12 && req.body.amPm === "PM"){
    timeInput = timeInput + 12;
  }
  if(timeInput === 12 && req.body.amPm === "AM"){
    timeInput = 0;
  }

  if(endTimeInput < 12 && req.body.amPm === "PM"){
    endTimeInput = endTimeInput + 12;
  }
  if(endTimeInput === 12 && req.body.amPm === "AM"){
    endTimeInput = 0;
  }

var createSessionLoop = endTimeInput-timeInput


var sessionGuid = CreateGuid();

  User.findOne({_id: req.user._id}).exec(function(err, foundUser){
    for (var z = 0; z < createSessionLoop; z++) {
    added = timeInput+z;
    console.log("=========" + added);
    var tutorRequest = new TutorRequest({tutor: req.user.SFname, note: "",sentReminderEmail: 'false', vcLink: req.user.vcLink, language: foundUser.language, tutorID: req.user._id, tutorEmail: req.user.username, status: "Available", sessionGroupId: sessionGuid,tutorSubject: subjectsArray, startTimestamp: dayjs(req.body.date + "-" + added, "YYYY-MM-DD-H").valueOf()});

    tutorRequest.save();
  }
  });
  res.redirect("/tutorRequestsView")
}else{
  res.redirect("/login")
}

});

// function convertToMillitary(timeInputVal){
//   if(timeInputVal < 12 && req.body.amPm === "PM"){
//     timeInputVal = timeInputVal + 12;
//   }
//   if(timeInputVal === 12 && req.body.amPm === "AM"){
//     timeInputVal = 0;
//   }
// }



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
const threeHoursInMillis = 3*60*60*1000;

      TutorRequest.find({ $and: [ { startTimestamp: { $gt: Date.now() + threeHoursInMillis} }, { status: "Available" } ] }).sort({startTimestamp: 1}).exec(function(err, foundMsgs) {
        TutorRequest.find({studentId: req.user._id}).sort({importance: 1 ,startTimestamp: 1}).exec(function(err, studentsMssgs){

          console.log(Date.now());


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

          // if(req.query.failure === 'true'){
          //   res.render
          // }

          var studentMssgBookedCount = JSON.stringify(studentMssgsWithCorrectTime);

          res.render("studentAccountPage", {mssgs: mssgsWithCorrectTime, studentsMssgs: studentMssgsWithCorrectTime, username: req.user.username, studentMssgBookedCount: studentMssgBookedCount});


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


app.get("/aboutUs", function(req, res){
  res.render("aboutUs");
});

// app.get("/admin", function(req, res){
//   var name;
//
//   User.countDocuments({age:{$gt:4,$lt:13}}).exec(function(err, numberOfStudents){
//     User.countDocuments({tutor: true}).exec(function(err, numberOfTutors){
//       TutorRequest.countDocuments({status: "Available"}).exec(function(err, availableSessions){
//         TutorRequest.countDocuments({$and: [{status: "Completed"},{studentName: {$exists:true}},{tutor: {$ne:"Tannen"}}]}).exec(function(err, completedSessions){
//           TutorRequest.countDocuments({$and: [{status: "Completed"},{studentName: {$exists:false}},{tutor: {$ne:"Tannen"}}]}).exec(function(err, expiredSessions){
//           User.find({tutor:true}).exec(function(err, allTutors){
//             res.render("admin", {numberOfStudents: numberOfStudents, numberOfTutors: numberOfTutors, availableSessions: availableSessions, completedSessions: completedSessions, expiredSessions: expiredSessions});
//             for(i=0;i<allTutors.length;i++){
//               console.log(allTutors[i].username);
//               name = allTutors[i].username
//               TutorRequest.countDocuments({tutorEmail: allTutors[i].username, studentUsername: {$ne : null}}).exec(function(err, numberOfSessionsPerTutor){
//
//               console.log(numberOfSessionsPerTutor);
//
//             });
//           };
//           });
//           });
//           });
//           });
//           });
//           });
// });

//Request Tutor


require("./requestTutor.js")(app, TutorRequest, passport, transporter, dayjs, querystring)


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

app.get("/donate", function(req, res){
  res.render("donate");
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

  TutorRequest.findOne({_id: req.body.msgID}, function(err, foundMsg){
    var mailOptions = {
      from: 'support@tut-tut.org',
      to: foundMsg.tutorEmail,
      subject: 'Tut-Tut Tutoring',
      html: "<p>Hello " + foundMsg.tutor + ",</p><p>Unfortunately, " + foundMsg.studentName + " has cancelled their session, and is unable to make the session at " + dayjs(foundMsg.startTimestamp).format("MM/DD/YYYY h:mm a") + ". If you are still available, and would like to reopen a session with a different student, click the link below.</p> <a href='https://www.tut-tut.org/tutorRequestsView'>https://www.tut-tut.org/tutorRequestsView</a><p>Sorry for the inconvenience,<br>Tut-Tut</p>"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response + req.body.email);
      }
    });
  });

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

    TutorRequest.findOne({_id: req.body.msgID}, function(err, foundMsg){
      var mailOptions = {
        from: 'support@tut-tut.org',
        to: foundMsg.studentUsername,
        subject: 'Tut-Tut Tutoring',
        html: "<p>Hello " + foundMsg.studentName + ",</p><p>Your tutor, "+ foundMsg.tutor+  " is unfortunately unable to make it and has cancelled your session at " + dayjs(foundMsg.startTimestamp).format("MM/DD/YYYY h:mm a") + ". If you are interested in rebooking a tutor session for a different time, please click the link below.</p> <a href='https://www.tut-tut.org/studentAccountPage'>https://www.tut-tut.org/studentAccountPage</a><p>Sorry for the inconvenience,<br>Tut-Tut</p>"
      };

      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response + req.body.email);
        }
      });
    });

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

console.log(Date.now() + 3600000);

let hourBeforeEmails = cron.schedule('* * * * *', () => {

  TutorRequest.find({sentReminderEmail : 'false', startTimestamp: {$lt: Date.now() + 3600000}, status: "Booked"}, function(err, foundMsgs){
    if(foundMsgs != null){
  console.log(foundMsgs);
  foundMsgs.forEach(function(msg){
    if(msg.studentUsername !== null || msg.studentUsername !== ""){
    var mailOptions = {
      from: 'support@tut-tut.org',
      to: msg.studentUsername,
      subject: 'Tut-Tut Tutoring',
      html: "<p>Hello " + msg.studentName + ",</p>" + "<p>This is a 1-hour reminder for your " + msg.subject + " session at " + dayjs(msg.startTimestamp).format("MM/DD/YYYY h:mm a") + ". The zoom link for your session is: "+ msg.vcLink+"</p><p>If you run into any issues, feel free to reply to this email chain for help.</p><p>See you soon,<br>Tut-Tut</p>"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response + req.body.email);
      }
    });
    var mailOptions = {
      from: 'support@tut-tut.org',
      to: msg.tutorEmail,
      subject: 'Tut-Tut Tutoring',
      html: "<p>Hello " + msg.tutor + ",</p>" + "<p>This is a 1-hour reminder for your " + msg.subject + " session at " + dayjs(msg.startTimestamp).format("MM/DD/YYYY h:mm a") + ". The zoom link for your session is: "+ msg.vcLink+"</p><p>If you run into any issues, feel free to reply to this email chain for help.</p><p>See you soon,<br>Tut-Tut</p>"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response + req.body.email);
      }
    });
  }
  });
}
});



// tests

// TESTS

TutorRequest.update({sentReminderEmail : 'false', startTimestamp: {$lt: Date.now() + 3600000}}, {sentReminderEmail: 'true'}, {multi: true},function(err, doc){
  console.log(err);
});
});



hourBeforeEmails.start();
// console.log(new Date());


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
