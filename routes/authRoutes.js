const { checkSignUp } = require("../middleware");
const controller = require("../controllers/auth");
const authRouter = require('express').Router()

authRouter.use(function(req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

authRouter.post("/signup",
  [
    checkSignUp.checkDuplicateUsernameOrEmail,
    checkSignUp.checkRolesExist
  ], 
  controller.signup
);

authRouter.post("/signin", controller.signin);

module.exports = authRouter