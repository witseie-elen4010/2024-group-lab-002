/*
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use( 
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.displayName) {
    return res.redirect("/");
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/loginPage.html");
});

app.post("/login", (req, res) => {
  const { displayName, password } = req.body;
  if (password === "brokenTelephone") {
    // Here you can handle the display name as needed, for example, you can store it in a session
    req.session.displayName = displayName;
    // Redirect to the main game page
    return res.redirect("/game"); // Change res.redirect to return res.redirect
  } else {
    res.send("Incorrect password. Please try again.");
  }
});

// Route to serve the game page with authentication middleware
app.get("/game", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
});

// Route to log out the user
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle drawing events
  socket.on("draw", (data) => {
    // Broadcast drawing data to all clients
    io.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/loggedInUsers", (req, res) => {
  const loggedInUsers = req.session.displayName
    ? [{ displayName: req.session.displayName }]
    : [];
  res.json(loggedInUsers);
});

module.exports = { app, server, io };

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (!req.session.displayName) {
    return res.redirect("/");
  }
  next();
};

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/loginPage.html");
});

app.post("/login", (req, res) => {
  const { displayName, password } = req.body;
  if (password === "brokenTelephone") {
    // Here you can handle the display name as needed, for example, you can store it in a session
    req.session.displayName = displayName;
    // Redirect to the main game page
    return res.redirect("/game"); // Change res.redirect to return res.redirect
  } else {
    res.send("Incorrect password. Please try again.");
  }
});

// Route to serve the game page with authentication middleware
app.get("/game", requireLogin, (req, res) => {
  res.sendFile(__dirname + "/public/game.html");
});

// Route to log out the user
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle drawing events
  socket.on("draw", (data) => {
    // Broadcast drawing data to all clients
    io.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.get("/loggedInUsers", (req, res) => {
  const loggedInUsers = req.session.displayName
    ? [{ displayName: req.session.displayName }]
    : [];
  res.json(loggedInUsers);
});

// Integrate with existing server code
const { app: serverApp, server: serverServer, io: serverIo } = require('./server.js');
serverApp.use(app);
serverServer.listen(3000, () => {
  console.log("Server running on port 3000");
});
serverIo.attach(serverServer);

module.exports = { app: serverApp, server: serverServer, io: serverIo };
*/