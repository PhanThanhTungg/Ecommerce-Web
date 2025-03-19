const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/user/google/callback`
},
  function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));

module.exports = passport;