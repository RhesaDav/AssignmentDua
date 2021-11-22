const JWT_SECRET =
  "1234";
var jwt = require("jsonwebtoken");

const user = require("./../models/user");
class AuthJWT {
  static authentication(req, res, next) {
    const { access_token } = req.headers;
    if (!access_token) {
      throw { name: "Missing_Token" };
    }
    jwt.verify(access_token, JWT_SECRET, (err, decoded) => {
      if (err) {
        throw { name: "INVALID_TOKEN" };
      }
      req.data = decoded;
    });

    next();
  }
  static async auth(req, res, next) {
    const { id } = req.params;
    console.log("ID_USER : ", id);
    console.log("req.data.id : ", req.data.id);
    try {
      const hasil = (
        await user.findOne({ _id: req.data.id })
      )._id.toString();
      console.log("HASIL : ", hasil);
      if (hasil === id) {
        next();
      } else {
        throw { name: "UNAUTHORIZED" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthJWT;
