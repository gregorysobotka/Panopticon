var express = require('express');
var router = express.Router();
const fs = require("fs");
const YAML = require('yaml');
const swaggerFile  = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.parse(swaggerFile);

// Route

const companiesRoutes = require('./companies.js');
const captureRoutes = require('./capture.js');
const backupRoutes = require('./backup.js');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Panopticon' });
});

router.use('/companies', companiesRoutes);
router.use('/capture', captureRoutes);
router.use('/backup', backupRoutes);

module.exports = router;