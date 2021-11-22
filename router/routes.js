const express = require('express');
const router = express.Router();
const AuthJWT = require('./../middleware/authjwt')

const barrackController = require('../controller/barrack-controller');
const marketController = require('../controller/market-controller');
const userController = require('../controller/user-controller')
const farmController = require('../controller/farm-controller')
const errorHandler = require('../middleware/errorHandler')

//user
router.post('/user', userController.createUser)
router.get('/user/login/:id',  userController.loginUser)
router.get('/user', userController.findUser)
router.delete('/user/:id',AuthJWT.authentication,AuthJWT.auth,  userController.deleteUser)
router.put('/user/:id',AuthJWT.authentication,AuthJWT.auth,  userController.updateUser)
router.get('/user/attack/:id',AuthJWT.authentication,AuthJWT.auth,  userController.attack)
//barrack
router.post('/barrack/:id',AuthJWT.authentication,AuthJWT.auth, barrackController.createBarrack)
router.get('/barrack/:id',AuthJWT.authentication,AuthJWT.auth, barrackController.findBarrack)
router.get('/barrackDetail/:id',AuthJWT.authentication,AuthJWT.auth, barrackController.findBarrackDetail)
router.delete('/barrack/:id',AuthJWT.authentication,AuthJWT.auth, barrackController.deleteBarrack)
router.put('/barrack/:id',AuthJWT.authentication,AuthJWT.auth, barrackController.updateBarrack)
router.get('/barrack/collect/:id',AuthJWT.authentication,AuthJWT.auth, barrackController.collectBarrack)
//market
router.post('/market/:id',AuthJWT.authentication,AuthJWT.auth, marketController.createMarket)
router.get('/market/:id',AuthJWT.authentication,AuthJWT.auth, marketController.findMarket)
router.get('/marketDetail/:id',AuthJWT.authentication,AuthJWT.auth, marketController.findMarketDetail)
router.delete('/market/:id',AuthJWT.authentication,AuthJWT.auth, marketController.deleteMarket)
router.put('/market/:id',AuthJWT.authentication,AuthJWT.auth, marketController.updateMarket)
router.get('/market/collect/:id', marketController.collectMarket)
//farm
router.post('/farm/:id',AuthJWT.authentication,AuthJWT.auth, farmController.createFarm)
router.get('/farm/:id',AuthJWT.authentication,AuthJWT.auth, farmController.findFarm)
router.get('/farmDetail/:id',AuthJWT.authentication,AuthJWT.auth, farmController.findFarmDetail)
router.delete('/farm/:id', AuthJWT.authentication,AuthJWT.auth, farmController.deleteFarm)
router.put('/farm/:id',AuthJWT.authentication,AuthJWT.auth, farmController.updateFarm)
router.get('/farm/collect/id',AuthJWT.authentication,AuthJWT.auth, farmController.collectFarm)
//errorHandler
router.use(errorHandler)

module.exports = router;