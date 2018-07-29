const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/filterdb');
var request = require('request');
var arraydata = [];
var Schema = mongoose.Schema;
var thingSchema = new Schema({}, { strict: false });
var Homes = mongoose.model('Homes', thingSchema);
var INDEX = 0;
console.log("Try to get Information of ultracasas")
request.get("https://www.ultracasas.com/api/app/inmuebles/publicaciones/search?pMin=M%C3%ADnimo&pMax=M%C3%A1ximo", (e, re, bb)=> {
    console.log("GIGANT PAGE Loaded!!! and parse ");
     reg = /["pk":]{1,1}[\d]{5,}[,]{1,1}/g
     arraydata = bb.match(reg);
     console.log("InitProcess with " + arraydata.length);
     console.log("Filter Repeated IDS")
     arraydata = arraydata.filter(function(item, pos) {
        return arraydata.indexOf(item) == pos;
     });
     console.log("Long with unique data " + arraydata.length);
     var ids = arraydata[INDEX].substr(1, arraydata[INDEX].length - 2);
     console.log("Check URL " + "https://www.ultracasas.com/api/app/inmuebles/publicaciones/detail?pk=" + ids);
     requestSystem("https://www.ultracasas.com/api/app/inmuebles/publicaciones/detail?pk=" + ids)
   });
var requestSystem = function(URL) {
     request.get(URL, (err, response, body) => {
       if(INDEX >= arraydata.length) {
         return;
       }
       if (err) {
         INDEX++
         requestSystem("https://www.ultracasas.com/api/app/inmuebles/publicaciones/detail?pk=" + ids);
       }
       var h = new Homes(JSON.parse(body));
       h.save();
       INDEX++;
       var ids = arraydata[INDEX].substr(1, arraydata[INDEX].length - 2);
       console.log("Check URL " + "https://www.ultracasas.com/api/app/inmuebles/publicaciones/detail?pk=" + ids);
       requestSystem("https://www.ultracasas.com/api/app/inmuebles/publicaciones/detail?pk=" + ids);
       console.log("save page " +  ids);
     });
   }
