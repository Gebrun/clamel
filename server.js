// Import of Express module

const express = require('express');

// Import of mongoose in the server

const mongoose = require('mongoose');

// Importing body-parser

const bodyParser = require('body-parser');

// Importing dotenv

require('dotenv').config()

// Importing passport

const passport = require('passport');

// Importing the strategies & way to extract the jsonwebtoken

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Import cors
const cors = require('cors');

// The same secret in routes/UsersRoutes will be needed
// to read the jsonwebtoken
const secret = process.env.SECRET;

// We need the UsersModel to find the user in the database
const UsersModel = require('./models/UsersModel');

// Options for passport-jwt
const passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret
};

// This function is what will read the contents (payload) of the jsonwebtoken
const passportJwt = (passport) => {
    passport.use(
        new JwtStrategy(
            passportJwtOptions, 
            (jwtPayload, done) => {

                // Extract and find the user by their id (contained jwt)
                UsersModel.findOne({ _id: jwtPayload.id })
                .then(
                    // If the document was found
                    (document) => {
                        return done(null, document);
                    }
                )
                .catch(
                    // If something went wrong with database search
                    (err) => {
                        return done(null, null);
                    }
                )
            }
        )
    )
};

// Importing routes

const ProjectsRoutes = require('./routes/ProjectsRoutes');
const FeedsRoutes = require('./routes/FeedsRoutes.js');
const UsersRoutes = require('./routes/UsersRoutes');
const EmailsRoutes = require('./routes/EmailsRoutes');

// Creating server object

const server = express();

// Configuring express to use body-parser

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(passport.initialize());
server.use(cors());


// Invoke passportJwt and pass the passport npm package as argument

passportJwt(passport);

// Database connection URL

const dbURL = process.env.DB_URL;

mongoose.connect(
    dbURL,
    {
        'useNewUrlParser': true,
        'useUnifiedTopology': true
    }
).then(
    ()=>{
        console.log('Officially connected to MongoDB !');
    }
).catch(
    (e)=>{
        console.log('catch', e);
    }
);


server.use(
    '/projects',
    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
    ProjectsRoutes
);


server.use(
    '/feeds',
    passport.authenticate('jwt', {session:false}), // Use passport-jwt to authenticate
    FeedsRoutes
);

server.use(
    '/users', 
    UsersRoutes
);

server.use(
    '/emails', 
    EmailsRoutes
);

// Creating route for the landing page

server.get(
    '/',
    (req, res) => {
        res.send("<h1>Welcome to CLAMEL Design</h1>")
    }
);

// Creating a route for the about page

server.get(
    '/about',
    (req, res) => {
        res.send(
            "<h1>About Us</h1>" +
            "<a href='/'>Home</a>"
        );
    }
);

// 404 Route

server.get('*', (req, res)=> {
    res.send('404! Page not found :(')
});


// Connecting to a port number

server.listen( 
    process.env.PORT || 8081, ()=>{
        console.log('You are connected http://127.0.0.1:8081!');
    }
);