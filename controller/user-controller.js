const user = require('../models/user');
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const JWT_SECRET = "1234"

class userController {
    static createUser = async (req, res) => {
        const result = await user.create({
            nama: req.body.nama,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 10),

        })
        res.status(200).json({ message: 'Create User Success', result })
    }

    static updateUser = async (req, res) => {
        const { id } = req.params;
        const { nama, email, password } = req.body;
        const result = await user.findOneAndUpdate({_id:id},{
            nama,
            email,
            password,
        },{new : true})
        res.status(200).json({messsage: 'Update Success', result})
    }

    static findUser = async (req, res, next) => {
        try {
            const result = await user.find();
            if (result.length == 0){
                throw {name: 'NOT_FOUND'}
            } else {
                res.status(200).json({ message: 'data found', result: result });
            }
        } catch(error){
            next(error)
        }
    }

    static deleteUser = async (req, res) => {
        const result = await user.findOneAndDelete({
            nama: req.body.nama,
        })
        res.status(200).json({ message: 'delete success', result})
    }

    static async loginUser(req, res, next) {
        try {
          const { nama, password } = req.body;
          console.log("req,body", req.body)
          const user_data = await user.findOne({ nama }).lean();
          console.log(user_data)
          if (!user_data) {
            throw { name: "INVALID_USERNAME" };
          }
          
          if (await bcrypt.compare(password, user_data.password)) {
            // Berhasil Login
            const token = jwt.sign(
              { id: user_data._id, nama: user_data.nama, email: user_data.email },
              JWT_SECRET
            );
            console.log(token)
            return res.status(200).json({
              status: "Berhasil Login",
              data: token,
            });
          } else {
            throw { name: "INVALID_PASSWORD" };
          }
        } catch (error) {
          next(error);
        }
      }

    



static async attack(req, res, next) {
    // DEKLARASI VARIABEL
    const { idUser } = req.params;
    const { MySoldier, idUserMusuh, SoldierMusuh } = req.body;
    // AKHIR DEKLARASI VARIABEL

    try {
      // DEKLARASI VARIABEL
      const dataMusuh = await userSchema.findOne({ _id: idUserMusuh });
      const data = await userSchema.findOne({ _id: idUser });
      // AKHIR DEKLARASI VARIABEL

      if (data && dataMusuh) {
        // DEKLARASI VARIABEL
        const soldier = data.townhall.resource.soldier;
        const soldier_musuh = dataMusuh.townhall.resource.soldier;
        // AKHIR DEKLARASI VARIABEL

        // PENGECEKAN JUMLAH SOLDIER MUSUH (<50?)
        if (soldier_musuh > 50) {
          // VALIDASI SOLDIER
          if (soldier < MySoldier || soldier === 0) {
            throw { name: "YOUR_SOLDIER_NOT_ENOUGH" };
            // res.status(400).json({ status: "Soldier MU Kurang" });
          } else if (soldier_musuh < SoldierMusuh || soldier_musuh === 0) {
            throw { name: "ENEMY_SOLDIER_NOT_ENOUGH" };
            // res.status(400).json({ status: "Soldier Musuh Kurang" });
          } else {
            // COMMAND UPDATE SOLDIER
            await userSchema.findOneAndUpdate(
              { _id: idUser },
              { $inc: { "townhall.resource.soldier": -MySoldier } }
            );
            await userSchema.findOneAndUpdate(
              { _id: idUserMusuh },
              { $inc: { "townhall.resource.soldier": -SoldierMusuh } }
            );
            // AKHIR COMMAND UPDATE SOLDIER

            // LOGIKA PENENTUAN MENANG KALAH
            const arr = [];
            for (let i = 0; i < 3; i++) {
              const coba = MySoldier / (SoldierMusuh + 1);
              arr.push(Math.random() < coba);
            }
            const isSuccess = arr.filter((el) => el).length >= 2 ? true : false;
            // AKHIR LOGIKA PENENTUAN MENANG KALAH

            // BILA MENANG
            if (isSuccess) {
              // DEKLARASI VARIABEL
              const goldLawan = dataMusuh.townhall.resource.golds;
              const foodLawan = dataMusuh.townhall.resource.foods;
              // AKHIR DEKLARASI VARIABEL

              // COMMAND UPDATE GOLD DAN FOOD
              await userSchema.findOneAndUpdate(
                { _id: idUser },
                {
                  $inc: {
                    "townhall.resource.medal": 5,
                    "townhall.resource.golds": Math.floor(goldLawan / 2),
                    "townhall.resource.foods": Math.floor(foodLawan / 2),
                  },
                }
              );
              await userSchema.findOneAndUpdate(
                { _id: idUserMusuh },
                {
                  "townhall.resource.soldier": 0,
                  "townhall.resource.golds": Math.floor(goldLawan / 2),
                  "townhall.resource.foods": Math.floor(foodLawan / 2),
                }
              );
              // AKHIR COMMAND UPDATE GOLD DAN FOOD

              // RESPONSE
              res.status(200).json({ status: "Berhasil Menang" });
              // RESPONSE
            } else {
              // BILA GAGAL
              // DEKLARASI VARIABEL
              const medal = data.townhall.resource.medal;
              // AKHIR DEKLARASI VARIABEL

              // COMMAND UPDATE MEDAL
              await userSchema.findOneAndUpdate(
                { _id: idUser },
                {
                  "townhall.resource.medal": Math.floor(medal / 2),
                }
              );
              await userSchema.findOneAndUpdate(
                { _id: idUserMusuh },
                {
                  $inc: {
                    "townhall.resource.medal": 2,
                  },
                }
              );
              // AKHIR COMMAND UPDATE MEDAL

              // RESPONSE
              res.status(200).json({ status: "Kalah" });
              // AKHIR RESPONSE
            }
          }
        } else {
          throw { name: "CANT_BE_ATTACED" };
        }
      } else {
        throw { name: "NOT_FOUND" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController