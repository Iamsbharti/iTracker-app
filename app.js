const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

/**Init Express server & envoirnment variables */
const app = express();

/**Middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist/iTracker-app")));
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});
console.log("env:", process.env.API_PORT);
/**Listener */
//const port = process.env.PORT;
let server = app.listen(3008, () =>
  console.log("FrontEnd Server launched at::", 3008)
);

//Init socket
console.log("SERVER_________:", server.listening);
