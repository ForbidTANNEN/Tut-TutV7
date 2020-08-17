module.exports = function(app, User, passport) {

  //LOGIN

  app.get("/login", function(req, res) {
    if (req.isAuthenticated()) {
      if (req.user.tutor === true) {
        res.redirect("/tutorRequestsView");
      } else {
        res.redirect("/studentAccountPage");
      }

    } else {
      res.render("login", {
        loginFailure: ""
      });
    }
  });

  //SIGNUP

  app.post("/signup", function(req, res) {

    if (req.isAuthenticated()) {
      if (req.user.tutor === true) {
        res.redirect("/tutorRequestsView");
      } else {
        res.redirect("/studentAccountPage");
      }
    } else {

      if(req.body.password === req.body.confirmPass){

      if (isNaN(req.body.age)) {
        res.render("signup", {
          signupFailure: "Please have age as a number"
        })
      } else {
        if (req.body.tutorSignUp === true) {
          isTutor = true;
        } else {
          isTutor = false;
        }
        if (req.body.TOS === "on" || req.body.thirteen === "on") {
          console.log("Clicked");

        User.findOne({
          capitalizedUsername: req.body.username.toUpperCase()
        }, function(err, foundUsers) {
          if (foundUsers === null) {
            User.register({
              username: req.body.username,
              capitalizedUsername: req.body.username.toUpperCase(),
              GFname: req.body.GFname,
              GLname: req.body.GLname,
              Phone: req.body.Phone,
              SFname: req.body.SFname,
              SLname: req.body.SLname,
              School: req.body.School,
              age: req.body.age,
              tutor: isTutor,
              accountCreationTime: Date.now()
            }, req.body.password, function(err, user) {
              if (err) {
                console.log(err);
                res.redirect("/signup");
              } else {
                passport.authenticate("local")(req, res, function() {
                  res.redirect("/studentAccountPage");
                });
              }
            })
          } else {
            res.render("signup", {
              signupFailure: "That email is already assigned to an account"
            });
          }
        })

      }else {
        res.render("signup", {
          signupFailure: "Please check Terms of service and 13 or older"
        });
      }

      }



    }else{
      console.log("Hellooooooooooooo");
      res.render("signup", {
        signupFailure: "Make sure that both password fields are the same"
      });

    }

    }


  });







  app.get("/signup", function(req, res) {
    res.render("signup", {
      signupFailure: ""
    });
  });

  app.get("/signupTutor", function(req, res) {
    res.render("signupTutor", {});
  })

  app.post("/logout", function(req, res) {
    if(req.isAuthenticated()){
    req.session.destroy();
    res.redirect("/");
  }
  else{
    res.redirect("/login")
  }
  });

  app.post('/login', (req, res, next) => {

    const user = new User({
      capitalizedUsername: req.body.username.toUpperCase(),
      password: req.body.password,
      age: null,
      tutor: null
    });

    passport.authenticate('local',
      (err, user, info) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          res.render("login", {
            loginFailure: info.message
          });
        }

        if (user.tutor === true) {
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }

            return res.redirect('/tutorRequestsView');
          });

        } else {

          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }

            return res.redirect('/studentAccountPage');
          });
        }

      })(req, res, next);
  });



}
