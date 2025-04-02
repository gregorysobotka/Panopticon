var express = require('express');
var router = express.Router();
const { compareCaptures } = require('../services/capture.js');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/images/diff/:imageOne/:imageTwo', async function(req, res, next) {
  try {
      
      const { imageOne, imageTwo } = req.params;

      const result = await compareCaptures(imageOne, imageTwo);
      res.type('png');
      res.send(result);

  } catch(e) {
      console.error(e)
      res.status(400).send('');
  }
});

module.exports = router;
