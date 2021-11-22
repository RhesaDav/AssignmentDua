const farm = require("../models/farm");
const user = require("../models/user");

class farmController {
  static async createFarm(req, res, next) {
    const { namaFarm } = req.body;
    const { id } = req.params;
    try {
      const user = await user.findById(id);
      if (
        user.townhall.resource.gold >= 10 &&
        user.townhall.resource.food >= 30
      ) {
        const result = await farm.create({ namaFarm });
        await user.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              "townhall.farm": result._id.toString(),
            },
            $inc: {
              "townhall.resource.gold": -10,
              "townhall.resource.food": -30,
            },
          }
        );
        res.status(200).json({ message: "create farm success", result });
      } else {
        throw { name: "resource tidak cukup" };
      }
    } catch (error) {
      next(error);
    }
  }

  static collectFarm = async (req, res) => {
    const { id } = req.params;
    const { idFarm } = req.body;
    const result = await farm.findOne({ _id: idFarm });
    const food = result.food;
    await farm.findOneAndUpdate({ _id: idFarm }, { $inc: { food: -food } });
    const update = await user.findOneAndUpdate(
      { _id: id },
      { $inc: { "townhall.resource.food": food } },
      { new: true }
    );
    res.status(200).send({ status: "collected food" });
  };

  static updateFarm = async (req, res) => {
    const { id } = req.params;
    const { namaFarm, food } = req.body;
    const result = await farm.findOneAndUpdate(
      { _id: id },
      {
        namaFarm,
        food,
      },
      { new: true }
    );
    res.status(200).json({ message: "Update Farm Success", result });
  };

  static findFarmDetail = async (req, res, next) => {
    const { id } = req.params;
    const { idFarm } = req.body;
    try {
      const result = await user.findOne({ _id: id }).populate("townhall.farm");
      const filtered = result.townhall.farm.filter(
        (farm) => farm._id.toString() == idFarm
      );
      if (filtered.length == 0) {
        throw { name: "FARM_NOT_FOUND" };
      } else {
        res
          .status(200)
          .json({ message: "farm detail found", result: filtered });
      }
    } catch (error) {
      next(error);
    }
  };

  static findFarm = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await user.findOne({ _id: id }).populate("townhall.farm");
      if (result.length == 0) {
        throw { name: "FARM_NOT_FOUND" };
      } else {
        res
          .status(200)
          .json({ message: "farm data found", result: result.townhall.farm });
      }
    } catch (error) {
      next(error);
    }
  };

  static deleteFarm = async (req, res) => {
    const result = await farm.findOneAndDelete({
      namaFarm: req.body.namaFarm,
    });
    res.status(200).json({ message: "delete farm success", result });
  };
}

module.exports = farmController;
