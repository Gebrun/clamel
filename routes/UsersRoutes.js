const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secret = process.env.SECRET;

const UsersModel = require("../models/UsersModel");

// /register
router.post(
  "/register", // http://localhost:8081/users/register
  (req, res) => {
    const formData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    };

    // Step 1) Generate a salt
    bcrypt.genSalt((err, salt) => {
      // Step 2) Generate a hash
      bcrypt.hash(
        formData.password, // first ingredient
        salt, // second ingredient
        (err, hashedPassword) => {
          const newUsersModel = new UsersModel(formData);

          // Step 3) Replace the original password with hash
          newUsersModel.password = hashedPassword;

          // Step 4) Save user data to database (with encrypted password)
          newUsersModel.save((err, dbResult) => {
            // If something goes wrong, send error
            if (err) {
              res.json({ message: err });
            }
            // Otherwise, send success message
            else {
              res.json({ message: "User has been saved" });
            }
          });
        }
      );
    });
  }
);

// /login
router.post("/login", (req, res) => {
  // npm packages: passport, passport-jwt, jsonwebtoken

  // Step 1. Capture formData (email & password)
  const formData = {
    email: req.body.email,
    password: req.body.password,
  };

  // Step 2a. In database, find account that matches email
  UsersModel.findOne({ email: formData.email }, (err, document) => {
    // Step 2b. If email NOT match, reject the login request
    if (!document) {
      res.json({ message: "Please check email or password" });
    }

    // Step 3. If there's matching email, examine the document's password
    else {
      // Step 4. Compare the encrypted password in db with incoming password
      bcrypt.compare(formData.password, document.password).then((isMatch) => {
        // Step 5a. If the password matches, generate web token (JWT)
        if (isMatch === true) {
          // Step 6. Send the JWT to the client
          const payload = {
            id: document.id,
            email: document.email,
          };

          jwt.sign(payload, secret, (err, jsonwebtoken) => {
            res.json({
              message: "Login successful",
              jsonwebtoken: jsonwebtoken,
            });
          });
        }

        // Step 5b. If password NOT match, reject login request
        else {
          res.json({ message: "Please check email or password" });
        }
      });
    }
  });
});

module.exports = router;
