var express = require('express');
var StationController = require('../Controllers/StationController');

var router = express.Router();

/* GET home page. */
router.get('/', StationController.getStationReport);

router.post('/refreshStations', StationController.refreshStationList);
module.exports = router;