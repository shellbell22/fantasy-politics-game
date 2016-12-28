var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Senator = require('./models/senators');
var config = require('./config');
var tracker = require('./tracker');
var User = require('./models/user-model');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var cookieParser = require('cookie-parser');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

/* Thinkful notes on code:
The first section of this should be pretty familiar. You create an Express app, and use the body-parser middleware to handle request bodies, and the static middleware to serve the static assets.
*/
var app = express();
var jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(cookieParser());
app.use(session({
  secret: 'meda',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}




/* Then you create a function called runServer. This is responsible for coordinating both the connection to the database, and the running of the HTTP server. First you use Mongoose to connect to the database, using the URL from config.js. Then you listen for new connections on the configured port. If all of that was successful, then you call an optional callback function to signal that everything is up and running. */

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }
        app.listen(config.PORT, function() {
            console.log('Listening on localhost: ' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

/* The if (require.main === module) statement at the bottom is a useful trick for making this file both an executable script, and a module. If the script is run directly (node server.js) then the runServer function will be called. But if the file is included from somewhere else (require('./server')) then the function won't be called, allowing the server to be started at a different point. */
if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}
exports.app = app;
exports.runServer = runServer;




/*The get endpoint fetches a list of all of the items from the database using Item.find, and returns them as JSON. The post endpoint creates a new item using Item.create, taking the item name from the request body, and returning a 201 Created status. If there is an error with the database in either case you return a 500 error with a JSON error message to indicate that something has gone wrong. You also add a catch all endpoint which will serve a 404 message if neither of the endpoints were hit by a request.*/



app.get('/senators', function(req, res) {
    Senator.find(function(err, senators) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json({
            senators: senators
        });
    });
});

app.get('/update', function(req, res) {
    tracker.updateSenators();
    res.sendStatus(200);
});

app.use(passport.initialize());

/*
You tell the Express app to integrate with passport using the app.use method. To protect the /hidden endpoint, you use the passport.authenticate middleware, saying that you will use the basic strategy. You also indicate that you don't want to store a session cookie to keep identifying the user - they will need to reauthenticate with each new API request.

If the user authenticates correctly, then the callback function will return some top-secret JSON.

app.get('/hidden', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({
        message: 'Luke... I am your father'
    });
});

*/

app.post('/senators', function(req, res) {
    Senator.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        party: req.body.party,
    }, function(err, senator) {
        if (err) {
            console.log(err);
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(senator);
    });
});



/* Here you check that the body contains a valid username and password, then you create and save the user.

Make sure that the run_mongod script is running your database. Then test your endpoint out by making a post request to create a new user. Remember you can test a GET route using your web browser address bar (although that's not ideal), but for all other HTTP methods you will need to use cURL:

curl -X POST -H "Content-Type: application/json" -d '{"username": "bknowles", "password": "uhohuhohuhohohnana"}' http://localhost:8080/users

*/

app.post('/users', jsonParser, function(req, res) {
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    var user = new User({
        username: username,
        password: password
    });

    bcrypt.genSalt(10, function(err, salt) {
       if (err) {
           return res.status(500).json({
               message: 'Internal server error'
           });
       }

       bcrypt.hash(password, salt, function(err, hash) {
           if (err) {
               return res.status(500).json({
                   message: 'Internal server error'
               });
           }

           var user = new User({
               username: username,
               password: hash
           });

           user.save(function(err) {
               if (err) {
                   return res.status(500).json({
                       message: 'Internal server error'
                   });
               }

               return res.status(201).json({});
           });
       });
   });
});


/* middleware - checks to make sure the user is valid */

var strategy = new LocalStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(strategy);

app.post('/login', passport.authenticate('local'), function(req, res) {
  return res.status(200).json({
    username: req.user.username,
    isAuthenticated: true
  });
});
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

/*
mongoose.createConnection('mongodb://localhost/fantasyauth').then(function() {
    app.listen(process.env.PORT || 8080);
});
*/
