const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CacheService = require("../services/redis");
const { checkDuplicate } = require("../middlewares/authMiddleware");

class AuthController {
  constructor() {
    this._cacheService = new CacheService();

    this.signUp = this.signUp.bind(this);
  }

  signUp(req, res) {
    checkDuplicate(req, res);
    let user = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    user.save(async (err, user) => {
      if (err) {
        return res.status(400).send({ message: err });
      }
      const { password, ...dataUser } = user.toJSON();
      await this._cacheService.delete(`users`);
      return res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: dataUser,
      });
    });
  }

  signIn(req, res) {
    const { emailAddress, password } = req.body;
    User.findOne({ emailAddress: emailAddress })
      .select("+password")
      .exec((err, user) => {
        if (err) return res.status(500).json({ status: "error", message: err });
        if (!user || !bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({
            message:
              "Authentication failed. Invalid Email Address or password.",
          });
        }
        return res.json({
          status: "success",
          message: "Login successful",
          accessToken: jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }),
        });
      });
  }
}

module.exports = AuthController;
