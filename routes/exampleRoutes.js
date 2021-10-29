const { authToken } = require("../middleware");
const exampleRouter = require('express').Router()

exampleRouter.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

exampleRouter.get("/all", (req, res) => {
  res.status(200).send("Public Content.");
});

exampleRouter.get("/user", [authToken.verifyToken], (req, res) => {
  res.status(200).send("User Content.");
});

exampleRouter.get("/admin", [authToken.verifyToken, authToken.isAdmin],
  (req, res) => {
    res.status(200).send("Admin Content.");
  }
);

module.exports = exampleRouter