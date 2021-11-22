const express = require('express');
const app = express();
const port = 3000
const router = require('./router/routes');
const {dbUser, CronJob} = require('./db-config/db')

dbUser()
CronJob()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', router)

app.listen(port, () => {
    console.log(`Sukses http://localhost:${port}`)
});
