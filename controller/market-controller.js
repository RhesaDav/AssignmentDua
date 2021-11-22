const market = require("../models/market");
const user = require("../models/user");

class marketController {
  static async createMarket(req, res, next) {
    const { namaMarket } = req.body;
    const { id } = req.params;
    try {
      const user = await user.findById(id);
      if (
        user.townhall.resource.gold >= 30 &&
        user.townhall.resource.food >= 10
      ) {
        const result = await market.create({ namaMarket });
        await user.findOneAndUpdate(
          { _id: id },
          {
            $push: {
              "townhall.market": result._id.toString(),
            },
            $inc: {
              "townhall.resource.gold": -30,
              "townhall.resource.food": -10,
            },
          }
        );
        res.status(200).json({ message: "create market success", result });
      } else {
        throw { name: "resource tidak cukup" };
      }
    } catch (error) {
      next(error);
    }
  }

  static collectMarket = async (req, res) => {
    const { id } = req.params;
    const { idMarket } = req.body;
    const result = await market.findOne({ _id: idMarket });
    const gold = result.gold;
    await market.findOneAndUpdate({ _id: idMarket }, { $inc: { gold: -gold } });
    const update = await user.findOneAndUpdate(
      { _id: id },
      { $inc: { "townhall.resource.gold": gold } },
      { new: true }
    );
    res.status(200).send({ status: "collected gold" });
  };

  static updateMarket = async (req, res) => {
    const { id } = req.params;
    const { namaMarket } = req.body;
    const result = await market.findOneAndUpdate(
      { _id: id },
      {
        namaMarket,
      },
      { new: true }
    );
    res.status(200).json({ message: "Update Market Success", result });
  };
  
  static findMarket = async (req, res, next) => {
    const { id } = req.params;
    try {
      const result = await user
        .findOne({ _id: id })
        .populate("townhall.market");
      if (!result) {
        throw { name: "MARKET_NOT_FOUND" };
      } else {
        res
          .status(200)
          .json({
            message: "market data found",
            result: result.townhall.market,
          });
      }
    } catch (error) {
      next(error);
    }
  };

  static findMarketDetail = async (req, res, next) => {
    const { id } = req.params;
    const { idMarket } = req.body;
    try {
      const result = await user
        .findOne({ _id: id })
        .populate("townhall.market");
      const filtered = result.townhall.market.filter(
        (market) => market._id.toString() == idMarket
      );
      if (result.length == 0) {
        throw { name: "MARKET_NOT_FOUND" };
      } else {
        res
          .status(200)
          .json({ message: "market data found", result: filtered });
      }
    } catch (error) {
      next(error);
    }
  };

  static deleteMarket = async (req, res) => {
    const result = await market.findOneAndDelete({
      namaMarket: req.body.namaMarket,
    });
    res.status(200).json({ message: "delete market success", result });
  };
}

module.exports = marketController;
