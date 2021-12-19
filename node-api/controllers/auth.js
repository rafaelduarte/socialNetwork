const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const User = require('../models/user');

require('dotenv').config();

exports.signup = async (req, res) => {
  const userExists = await User.findOne({
    email: req.body.email,
  });
  if (userExists)
    return res.status(403).json({
      error: 'Email is already registered.',
    });
  const user = await new User(req.body);
  await user.save();
  res.json({ message: 'Signup was successful! Please login.' });
};

exports.signin = (req, res) => {
  // find user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    // if error or user does not exist
    if (err || !user) {
      return res.status(401).json({
        error: 'Email is not registered. Please signin.',
      });
    }

    // if user exists, authenticate
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password do not match.',
      });
    }

    // generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist the token as 't' in cookie with expiry date (15 minutes)
    res.cookie('t', token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });

    // return response with user and token to frontend client
    const { _id, name } = user;

    return res.json({ token, user: { _id, email, name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('t');
  res.json({ message: 'Signout success.' });
};

exports.requireSignin = expressJwt({
  // if the token is valid, express-jwt appends the verified users id
  // in an auth key to the requet object
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});
