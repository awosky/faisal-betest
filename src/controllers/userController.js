const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const CacheService = require("../services/redis");

class UserController {
  constructor() {
    this._cacheService = new CacheService();

    this.getUsers = this.getUsers.bind(this);
    this.addUser = this.addUser.bind(this);
    this.editUser = this.editUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getUsers(req, res) {
    const { accountNumber, identityNumber } = req.query;
    let query = {};
    if (accountNumber) query.accountNumber = accountNumber;
    if (identityNumber) query.identityNumber = identityNumber;

    try {
      let users;
      if (Object.keys(query).length == 0) {
        users = await this._cacheService.get(`users`);
      }
      return res.json({ status: "success", data: JSON.parse(users) });
    } catch (err) {
      User.find(query, { userName: 1, emailAddress: 1 }, async (err, users) => {
        if (err) return res.status(500).json({ status: "error", message: err });
        if (Object.keys(query).length == 0) {
          await this._cacheService.set(`users`, JSON.stringify(users));
        }
        return res.json({ status: "success", data: users });
      });
    }
  }

  getUser(req, res) {
    User.findById(req.params.userId, (err, user) => {
      if (err) return res.status(500).json({ status: "error", message: err });
      if (!user)
        return res
          .status(400)
          .json({ status: "error", message: "User not found" });
      return res.json({ status: "success", data: user });
    });
  }

  addUser(req, res, next) {
    let user = new User({
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    user.save(async (err, user) => {
      if (err) return res.status(400).send({ message: err });
      const { password, ...dataUser } = user.toJSON();
      await this._cacheService.delete(`users`);
      return res.status(201).json({
        status: "success",
        message: "User added successfully",
        data: dataUser,
      });
    });
  }

  editUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("+password")
      .exec((err, user) => {
        if (err) return res.status(500).json({ status: "error", message: err });
        if (!user)
          return res
            .status(400)
            .json({ status: "error", message: "User not found" });

        const {
          userName,
          accountNumber,
          emailAddress,
          identityNumber,
          password,
        } = req.body;

        if (userName) user.userName = userName;
        if (accountNumber) user.accountNumber = accountNumber;
        if (emailAddress) user.emailAddress = emailAddress;
        if (identityNumber) user.identityNumber = identityNumber;
        if (password) user.password = bcrypt.hashSync(password, 10);

        user.save(async (err) => {
          if (err)
            return res.status(400).json({ status: "error", message: err });
          const { password, ...dataUser } = user.toJSON();
          await this._cacheService.delete(`users`);
          return res.json({
            status: "success",
            message: "User updated successfully",
            data: dataUser,
          });
        });
      });
  }

  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId }, async (err, user) => {
      if (err) return res.status(400).json({ status: "error", message: err });
      if (!user)
        return res
          .status(400)
          .json({ status: "error", message: "User not found" });
      await this._cacheService.delete(`users`);
      res.json({
        status: "success",
        message: "User deleted successfully",
      });
    });
  }
}

module.exports = UserController;
