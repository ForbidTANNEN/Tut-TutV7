
module.exports = function(app, TutorRequest, passport, transporter, dayjs, querystring){


app.post("/getTutor", function(req, res){

  TutorRequest.findOne({_id: req.body.tableInput}, function(err, foundMsg){

    if(foundMsg.status === "Booked"){
        res.redirect("/studentAccountPage?alert=alreadyBooked")
    }else{
      console.log(req.body.grade);

      // if(req.body.grade != null){


      console.log(req.body.tableInput);


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
        TutorRequest.findOne({_id: req.body.tableInput}).exec(function(err, tutorRequestInfo){


          if(tutorRequestInfo.sessionGroupId != null){

              TutorRequest.update({$and: [ { sessionGroupId: tutorRequestInfo.sessionGroupId}, { status: "Available" } ]}, {status: "Canceled"}, {multi: true},function(err, doc){

              });

          }else {

          }
          // if(tutorRequestInfo.sessionGroupId)

          var dateFormatted = dayjs(tutorRequestInfo.startTimestamp);

          msgDate = dateFormatted.format('MM/DD/YYYY')
          time1 = dateFormatted.format('hh:mm')
          time2 = dateFormatted.format('hh:45 A')
          msgTime = time1 + " - " + time2

          var mailOptions = {
            from: 'support@tut-tut.org',
            to: req.user.username,
            subject: 'Tut-Tut Tutoring',
            html: "<p>Hello " + tutorRequestInfo.studentName + ",</p><p>Thank you for booking a tutoring session with Tut-Tut. Please set a reminder to not forget your " + tutorRequestInfo.subject + " tutoring session on " + msgDate + " at " + msgTime + ".</p><p>We look forward to seeing you, <br> Tut-Tut</p>"
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
            to: tutorRequestInfo.tutorEmail,
            subject: 'Tut-Tut Tutoring',
            html: "<p>Hello " + tutorRequestInfo.tutor + ",</p><p>The student, " + tutorRequestInfo.studentName + " has booked your " + tutorRequestInfo.subject + " tutoring session for " + msgDate + " at " + msgTime + ". More specific information about this tutoring session can be found on your Tut-Tut account page!</p><p>We look forward to seeing you, <br> Tut-Tut</p>"
          };

          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response + req.body.email);
            }
          });

            res.redirect("/studentAccountPage");

        });
      });


    // }else {
    //   console.log("CALLED GET TUTOR:");
    //   res.redirect('/studentAccountPage?failure=true')
    // }
}

  });

});
}
