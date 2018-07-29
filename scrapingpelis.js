var request = require('request');
var fs = require("fs");
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moviedb');



var Schema = mongoose.Schema;
var thingSchema = new Schema({}, { strict: false });
var moviesdb = mongoose.model('movies', thingSchema);

//moviesdb.find({title : "gato"}).exec((err, docs) => {
  //console.log(docs.length);
//});

var getdata = true;
var url = "http://www.cliver.tv/frm/cargar-mas.php";
var pageglobal = 40;
var yeartotal = 2016;
//var movieslist = [];
//movieslist.push({id: "3895"})
//getStreamData(movieslist[0]);
var totalpagepelis = 0;
var indexmovies = 0;
var movieslist = [];
/*request.get("https://oload.download/embed/aeBBamiFKo8/VOSE-DVDRIP_C.0.C.4.1.N.3_G.0.D.M.0.T.H.3.R.mp4", (err, html) => {
  fs.writeFile("./file6.txt", html.body);
});*/
getInformation(yeartotal, pageglobal);
function getInformation (year, page) {
  request.post(url, {form: {tipo: "anio", adicional: year, pagina: page}}, (err, html) => {
    if (html != null && html.body != "error") {
      var regx = /<a href="([.:a-z0-9\/-]){1,}">/g
      var regx2 = /src="([.:a-z0-9_\/-]){1,}/g
      var data = html.body.match(regx);
      var imgs = html.body.match(regx2);
      var links = [];
      for (var i = 0; i < data.length; i ++) {
        links.push(data[i].substring(9, data[i].length-2));
      }
      var imgslinks = [];
      var idslist = [];
      for (var i = 0; i < imgs.length; i ++) {
        imgslinks.push(imgs[i].substring(5, imgs[i].length));
        ids = imgs[i].match(/[\d]{2,}/g);
        idslist.push(ids);
      }
      var uniques = links.filter( (item, item2, arr)=>{
          if (arr.indexOf(item) == item2) {
              return true;
          }
      });
      var i = 0;
      console.log("Tratando de obtener " + idslist.length + " Peliculas!");
      movieslist = [];
      if (idslist.length == imgslinks.length && idslist.length ==  uniques.length) {
        totalpagepelis = idslist.length;
        //create structure;
        console.log("La data es consistente");
        for (var i = 0; i < idslist.length; i ++) {
          movieslist.push({idmovie: idslist[i][0], poster: imgslinks[i], urlpage: uniques[i]})
        }
        indexmovies = 0;
        getMoreInformation(movieslist[indexmovies]);
        //getStreamData(movieslist[2]);
      } else {
        console.log("Informacion inconsistente!");
        pageglobal++
        console.log("-------------------------------------------"  )
        console.log("Cambiamos de pagina a " + pageglobal )
        getInformation(yeartotal, pageglobal);

      }
      //console.log(idslist);
      //console.log(imgslinks);
      //console.log(movieslist);
    } else {
      console.log("terminada la recoleccion de datos del anio " + year);
      console.log("Cambiando de anio  ");
      yeartotal--;
      if (yeartotal > 1993) {
        pageglobal = 0;
        console.log("-------------------------------------------")
        console.log("para   " + yeartotal + " pagina  " + pageglobal);
        getInformation(yeartotal, pageglobal);
      }
    }
  });
}
function getMoreInformation(movies) {
  request.get(movies.urlpage, (err, data) => {
    var fechaexp = /[0-9]{2,2} [A-Za-z]{3,3} [\d]{4,4}/g
    var durationexp = /[\d]{1,1}h [\d]{2,2}min./g
    var categoryblock = /<span class="block">.{1,}<\/span><\/p>/g
    var namescategoryexp = />[a-zA-Z0-9óáéíú]{1,}</g
    var sinopsisexp = /<\/p>\n<p>[a-z A-Z0-9,éáóíúñ]{10,}.<\/p>/g

    var fecha = data.body.match(fechaexp);
    var duration = data.body.match(durationexp);


    if (fecha) {
      movies["date"] = fecha[0];
    } else {
      movies["date"] = "";
    }
    if (duration != null) {
      movies["duration"] = duration[0];
    } else {
      movies["duration"] = '';
    }
    var resutlblock = data.body.match(categoryblock);
    var sinopsis = data.body.match(sinopsisexp);
    if (sinopsis != null) {
        sinopsis = sinopsis[0].substring(8, sinopsis[0].length - 4);
        movies["sinopsis"] = sinopsis;
    } else {
      movies["sinopsis"] = "";
    }
    if (resutlblock != null) {
      var resultblockchain = resutlblock[0];
      var categorydrity = resultblockchain.match(namescategoryexp);
      var categoryclean = [];
      if (categorydrity != null) {
        for (var i = 0; i < categorydrity.length; i++) {
          categoryclean.push(categorydrity[i].substring(1,categorydrity[i].length - 1));
        }
        movies["category"] = categoryclean;
      } else {
        movies["category"] = [];
      }
      getStreamData(movies);
      //console.log(movies);
    }
    //console.log(resutlblock);
  });
}
function getStreamData(movies) {
  //console.log(movies);
  request.post("http://www.cliver.tv/frm/obtener-enlaces-pelicula.php", {form: {pelicula: Number(movies.idmovie)}}, (err, html, data) => {
      if (html.body != "") {
        var json = JSON.parse(html.body);
        if (json.vose != null && json.vose.length > 0) {
          movies['title'] = json.vose[0].titulo;
          movies['language'] = json.vose[0].idioma;
          movies['token'] = json.vose[0].token;
        }
        if (json.es_la != null && json.es_la.length > 0) {
          movies['title'] = json.es_la[0].titulo;
          movies['language'] = json.es_la[0].idioma;
          movies['token'] = json.es_la[0].token;
        }
        getURLMovie(movies);
      } else {
        getURLMovie(movies);
      }
  });
}
function getURLMovie (movies) {
  request.post("http://stream.cliver.tv/getFile.php", {form: {hash: movies.token}}, (err, html) => {
    if (err) {
      console.log("---- ERROR ----- anio " + yeartotal + " pagina " + pageglobal);
      return;
    }
    if (html.body != "") {
      var json = JSON.parse(html.body);
      movies['active'] = true;
      movies['url'] = json.url;
    } else {
      movies['active'] = false;
    }
    indexmovies ++;

    moviesdb.find({"idmovie" : movies.idmovie}).exec((err, docs) => {
      console.log("CHECK LOG in ")
      console.log(docs)

      if (docs.length == 0) {
        console.log("save move")
        console.log(movies);
        //last check

        var mm = new moviesdb(movies);
        mm.save();
      } else {
        console.log("la pelicula ya existe en la base de datos");
      }
    });
    if (indexmovies  < totalpagepelis) {
      getMoreInformation(movieslist[indexmovies]);
    } else {
      //Movemos la pagina
      pageglobal++
      console.log("-------------------------------------------"  )
      console.log("Recolectamos en  " + yeartotal + " -- " + " Cambiamos de pagina a " + pageglobal )
      getInformation(yeartotal, pageglobal);
    }
  });
}
