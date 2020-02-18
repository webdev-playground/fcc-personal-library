"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

app.use("/public", express.static(__dirname + "/public"));

app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(
  helmet({
    frameguard: false,
    hidePoweredBy: {
      setTo: "PHP 4.2.0"
    }
  })
);
app.use(helmet.noCache());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type("text")
    .send("Not Found");
});

// Mongoose
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to DB.");
    //Start our server and tests!
    app.listen(process.env.PORT || 3000, function() {
      console.log("Listening on port " + process.env.PORT);
      if (process.env.NODE_ENV === "test") {
        console.log("Running Tests...");
        setTimeout(function() {
          try {
            runner.run();
          } catch (e) {
            var error = e;
            console.log("Tests are not valid:");
            console.log(error);
          }
        }, 1500);
      }
    });
  })
  .catch(err => {
    throw err;
  });

module.exports = app; //for unit/functional testing
