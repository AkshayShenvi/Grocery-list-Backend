require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");

const users = require("./routes/users");
const listdetails = require("./routes/listdetails");
const lists = require("./routes/lists");
// const path = require("path");
const app = express();

//----------------------------Middleware-----------------------------------------
app.use(
  cors({
    origin: "https://grocery-app-frontend.herokuapp.com/", // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "../grocery-list-frontend/build")));
//----------------------------- DB Config---------------------------------------------------

try {
  const mongo_uri = `mongodb+srv://mongodb:${process.env.DB_PASSWORD}@akshaycluster.bkck6.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected");
} catch (error) {
  console.log(error);
}
//----------------------------Passport Authentication Config ----------------
// Passport middleware
app.use(passport.initialize());
// Passport config
require("./passport")(passport);
app.use(
  session({
    secret: "grocery app",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static("public"));

//-------------------------------- Routes Middleware -------------------------------
app.use("/listdetails", listdetails);
app.use("/lists", lists);
app.use("/api/users", users);

app.get("/", (req, res) => {
  res.send("Working");
});
// app.get("*", (req, res) => {
//   res.sendFile(
//     path.join(__dirname, "../grocery-list-frontend/build/index.html")
//   );
// });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("App is running on port: " + port);
});
