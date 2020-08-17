
module.exports = function(app, TutorRequest, passport, transporter, dayjs){


app.post("/getTutor", function(req, res){

  console.log(req.body.tableInput);

  TutorRequest.findOne({_id: req.body.tableInput}).exec(function(err, studentsMssgs){
    console.log(studentsMssgs);
  });


  console.log("SUBTOPIC: " + req.body.subTopic);

  TutorRequest.findOneAndUpdate({_id: req.body.tableInput}, {

    status: "Booked",
    studentId: req.user._id,
    studentUsername: req.user.username,
    studentName: req.user.SFname,
    subTopic: req.body.subTopic,
    grade: req.body.grade,
    timeOfAccept: Date.now(),
    note: req.body.note,
    importance: 1,
    subject: req.body.ddl


  }, function(err, doc) {
    console.log(err);
  });


  res.redirect("/studentAccountPage");

  TutorRequest.findOne({_id: req.body.tableInput}).exec(function(err, tutorRequestInfo){

    console.log(tutorRequestInfo.startTimestamp);
    var dateFormatted = dayjs(tutorRequestInfo.startTimestamp);

    msgDate = dateFormatted.format('MM/DD/YYYY')
    time1 = dateFormatted.format('hh:mm')
    time2 = dateFormatted.format('hh:45 A')
    msgTime = time1 + " - " + time2

    var mailOptions = {
      from: 'halltannen@gmail.com',
      to: req.user.username,
      subject: 'Tut-Tut Tutoring',
      text: 'Your request for '+ tutorRequestInfo.subject +' tutoring request has been accepted, for ' + msgDate + ' at ' + msgTime
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response + req.body.email);
      }
    });

    var mailOptions = {
      from: 'halltannen@gmail.com',
      to: tutorRequestInfo.tutorEmail,
      subject: 'Tut-Tut Tutoring',
      text: 'Your request for '+ tutorRequestInfo.subject +' tutoring request has been accepted, for ' + msgDate + ' at ' + msgTime
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response + req.body.email);
      }
    });

  });



});
}
