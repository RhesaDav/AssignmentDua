const mongoose = require('mongoose')
const barrack = require('./../models/barrack')
const farm = require('./../models/farm')
const market = require('./../models/market')
function dbUser () {
    main().catch((err) => console.log(err));
    async function main() {
        await mongoose.connect('mongodb://localhost:27017/dbUser')
        console.log('database tersambung')
    
    }
}
function  CronJob  (){
     mongoose.connection.once("open", async  () => {
        var CronJob = require('cron').CronJob;
        var job = new CronJob(      
        '* * * * * * ',
        async () => {
            await barrack.updateMany(
              { soldier: { $lt: 10 } },
              { $inc: { soldier: 1 } }
            );
            await farm.updateMany(
              { food: { $lt: 20 } },
              { $inc: { food: 1 } }
            );
            await market.updateMany(
              { gold: { $lt: 20 } },
              { $inc: { gold: 1 } }
            );

          },
        null,
        true,
        'America/Los_Angeles'
        );

    job.start()

    })
}
module.exports = {dbUser,CronJob }
