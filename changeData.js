const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moviedb');
var Schema = mongoose.Schema;
var thingSchema = new Schema({}, { strict: false });
var moviesdb = mongoose.model('movies', thingSchema);
//var moviesdb = mongoose.model('category', thingSchema);
var cc = 0;
moviesdb.find({}).exec((err, docs) => {
  for (var i = 0; i < docs.length; i++) {
    var newtitle = docs[i].toJSON().title + "";
    //console.log(newtitle.toLocaleLowerCase());
    moviesdb.update({idmovie: docs[i].toJSON().idmovie}, {$set:{realurl:false, searchtitle: newtitle.toLocaleLowerCase()}}, function(err, d) {
      cc++
      console.log(d);
      console.log(cc);
    });
  }
});
/*var names = ["Acción",
"Comedia",
"Terror",
"Ciencia ficción",
"Drama",
"Musical",
"Animación",
"Histórico",
"Policíaco",
"Bélico ",
"Western",
"Fantasía",
"Deportivo ",
"Artes marciales",
"Zombis",
"Catástrofes",
"Gore",
"Misterio",
"Suspenso",
"Romántico",
"Biográfica",
"Crimen",
"Aventura",
"Familia",
"Espionaje",
"Hombres lobo",
"Vampiros",
"Anime",
"Navidad",
"Robots",
"Religión",
"Documental",
"Política"];
for (var i = 0; i < names.length; i++) {
  var catgory = new moviesdb({name:names[i]});
  catgory.save().then(() => {console.log("save")})
}*/
