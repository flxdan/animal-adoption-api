const db = require('../models')
const Roles = db.roles
const User = db.user

checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({username: req.body.username})
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Username is already in use!" });
            return;
        }

        User.findOne({email: req.body.email})
        .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "Email is already in use!" });
            return;
        }
        next();
      });
    });
};

checkRolesExist = (req, res, next) => {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!Roles.includes(req.body.roles[i])) {
          res.status(400).send({
            message: `Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }
  
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExist
};
  
module.exports = verifySignUp;