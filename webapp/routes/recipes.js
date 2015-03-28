var express = require('express');
var router = express.Router();

/* GET recipe listing. */
router.get('/recipelist', function(req, res, next) {
  var db = req.db;
  db.collection('recipelist').find().toArray(function (err, items) {
    res.json(items);
  });
});


/*
* POST to addrecipe.
*/
router.post('/addrecipe', function(req, res) {
  var db = req.db;
  db.collection('recipelist').insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
  });
});

/*
 * DELETE to deleterecipe.
 */
router.delete('/deleterecipe/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('recipelist').removeById(userToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
