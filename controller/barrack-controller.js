const barrack = require("../models/barrack");
const User = require("../models/user");

class barrackController {
  static async createBarrack(req, res, next) {
    const { namaBarrack } = req.body;
    const { id } = req.params;
    console.log("nama", namaBarrack);
    try {
      const user = await User.findById(id);
      if (
        user.townhall.resource.gold >= 30 &&
        user.townhall.resource.food >= 30
      ) {
        const result = await barrack.create({ namaBarrack });
        console.log(result);
        await User.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              "townhall.barrack": result._id.toString(),
            },
            $inc: {
              "townhall.resource.gold": -30,
              "townhall.resource.food": -30,
            },
          }
        );
        res.status(200).json({ message: "create barrack success", result });
      } else {
        throw { name: "resource tidak cukup" };
      }
    } catch (error) {
      next(error);
    }
  }

  static collectBarrack = async (req, res) => {
    const { id } = req.params;
    const { idBarrack } = req.body;
    const result = await barrack.findOne({ _id: idBarrack });
    const soldier = result.soldier;
    await barrack.findOneAndUpdate(
      { _id: idBarrack },
      { $inc: { soldier: -soldier } }
    );
    const update = await User.findOneAndUpdate(
      { _id: id },
      { $inc: { "townhall.resource.soldier": soldier } },
      { new: true }
    );
    res.status(200).send({ status: "collected soldier" });
  };

  static updateBarrack = async (req, res) => {
    const { id } = req.params;
    const { namaBarrack, soldier } = req.body;
    const result = await barrack.findOneAndUpdate(
      { _id: id },
      {
        namaBarrack,
        soldier,
      },
      { new: true }
    );
    res.status(200).json({ message: "Update Success", result });
  };

  static findBarrack = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await user
        .findOne({ _id: id })
        .populate("townhall.barrack");
      if (result.length == 0) {
        throw { name: "BARRACK_NOT_FOUND" };
      } else {
        res
          .status(200)
          .json({ message: "barrack found", result: result.townhall.barrack });
      }
    } catch (error) {
      next(error);
    }
  };

  static findBarrackDetail = async (req, res, next) => {
    const { id } = req.params;
    const { idBarrack } = req.body;
    try {
      const result = await user
        .findOne({ _id: id })
        .populate("townhall.barrack");
      const filtered = result.townhall.barrack.filter(
        (barrack) => barrack._id.toString() == idBarrack
      );
      if (filtered.length == 0) {
        throw { name: "BARRACK_NOT_FOUND" };
      } else {
        res
          .status(200)
          .json({ message: "barrack detail found", result: filtered });
      }
    } catch (error) {
      next(error);
    }
  };

  static deleteBarrack = async (req, res) => {
    const result = await barrack.findOneAndDelete({
      namaBarrack: req.body.namaBarrack,
    });
    res.status(200).json({ message: "delete barrack success", result });
  };
}

module.exports = barrackController;
