const express = require("express");
const session = require("express-session");
const passport = require("passport");

const { secret } = require("./config");

const strategy = require(`${__dirname}/strategy.js`);
const request = require("request");

const app = express();
app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get(
  "/login",
  passport.authenticate("auth0", {
    successRedirect: "/followers",
    failureRedirect: "/login",
    failureFlash: true,
    connection: "github"
  })
);

app.get("/followers", (req, res, next) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.redirect("/login");
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
