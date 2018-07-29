var request = require('request');

var express = require('express');
var router = express.Router();
var moongose = require('mongoose');
moongose.connect('mongodb://localhost/moviedb');
var Schema = moongose.Schema;
var thingSchema = new Schema({}, { strict: false });
var movies = moongose.model('movies', thingSchema);
var category = moongose.model('categories', thingSchema);

router.get('/jsonlist', (req, res) => {
  var params = req.query;
  var limit = 100;
  var skip = 0;
  if (params.limit != undefined && params.skip != undefined) {
    limit = Number(params.limit);
    skip = Number(params.skip);
  }
  console.log(limit + "  " + skip)

  movies.find({active: true, realurl: false}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({'error' : 'error en la db'});
      return;
    }
    res.status(200).json(docs);
    return;
  });
});
/*
Android Lis Test
*/
router.get('/list', function (req, res, next) {
  var results = [];
  var response = 0;
  category.find({}, (err, resdocs) => {
    //console.log(resdocs)
      //var items = resdocs[0].toJSON();
      reload(0)
      function reload(id) {
        movies.find({realurl: false, category: resdocs[id].toJSON().name}, (err, docs) => {
          //console.log(id);
          if (docs.length > 0) {
            results.push({name: resdocs[id].toJSON().name, list: docs, tam: docs.length});
          }
          if(id < resdocs.length - 1) {
            id++
            reload(id);
          } else {
            res.status(200).json(results);
            return;
          }
        });
      }
  });
});
router.get('/', function(req, res, next) {
  var limit = 50;
  var skip = 0;
  movies.findOne({active: true, realurl:false}, (err, docs) => {
    if (err) {
      res.status(200).json({"error" : err});
      return;
    }
    //res.status(200).
    res.render("index", docs.toJSON());
  });
});
router.post('/', (req, res) => {
  var url = req.url;
  //var id = url.split("/")[0];
  var keys = Object.keys(req.body);
  var home = {};
  for (var i = 0; i < keys.length; i++) {
    home[keys[i]] = req.body[keys[i]];
  }
  console.log(home);
  movies.findOneAndUpdate({"idmovie": home.idmovie}, {realpath: home.realpath, realurl : true}, (err, params) => {
      console.log(err);
      console.log(params);

      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.redirect('/');
      //res.render("layout", params);
      return;
  });
});

/* GET users listing. */

/*router.get('/', function(req, res, next) {
  var limit = 50;
  var skip = 0;
  var params = req.query;
  var queryObject = {};
  if (params.limit != undefined && params.skip != undefined) {
    limit = params.limit;
    skip = params.skip;
  }
  if (params.region != undefined) {
    console.log(params.region);
    queryObject["oProperty.region"] = params.region;
  }
  if (params.direction != undefined) {
    console.log(params.direction);
    queryObject["oProperty.direccion"] = new RegExp(params.direction, "i");
  }
  console.log(queryObject);
  Homes.find(queryObject).skip(skip).limit(limit).exec((error, docs) => {
    res.status(200).json(docs);
  });
});*/

module.exports = router;
