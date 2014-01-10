var http = require('http');
var interactions;

var fs = require('fs');
var file = __dirname + '/pacts/register.json';

fs.readFile(file, 'utf8', function(err, json) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }

  data = JSON.parse(json);

  interactions = data.interactions;

});

function get(method, path, body) {

  for (var i in interactions) {

    var interaction = interactions[i];

    if (interaction.request.path.toString() === path) {
      var _body = interaction.request.body;


      var requestBody;
      if (body) {
        requestBody = JSON.parse(body);
      }

      if ((body && _body && JSON.stringify(_body) == JSON.stringify(requestBody)) || (!requestBody && !_body)) {

        return interaction.response;
      }
    }

  }

};

http.createServer(function(req, res) {

  if (req.method == 'POST') {
    console.log("[200] " + req.method + " to " + req.url);
    var body = '';
    req.on('data', function(chunk) {
      body = body + chunk.toString();
    });


    req.on('end', function() {
      console.log("Received body data:");
      console.log(body);

      // empty 200 OK response for now
      var response = get(req.method, req.url, body)

      if (response) {
        res.writeHead(response.status, "OK", response.headers);
        res.end(JSON.stringify(response.body));
      } else {
        res.writeHead(404, "Bad Request", {
          'Content-Type': 'application/json'
        });
        res.end('{"status":"loss test cases"}');
      }

    });

  } else {
    console.log("[405] " + req.method + " to " + req.url);
    res.writeHead(405, "Method not supported", {
      'Content-Type': 'text/html'
    });
    res.end('<html><head><title>405 - Method not supported</title></head><body><h1>Method not supported.</h1></body></html>');
  }


}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');