var net = require("net");

var s = new net.Socket();
var port = "7777";
var host = "localhost";
s.connect(port, host, function() {
    console.log('Connected: ' + port);
});
s.on("data", function(packet) {
  console.log(packet);
})
