let WSServer = require('ws').Server;
let server = null;
let app = require('./http-server');

if (process.env.HTTPS == "true") {
  const https = require('https');
  const fs = require('fs');
  const options = {
    key: fs.readFileSync('.cert/certificate.key'),
    cert: fs.readFileSync('.cert/certificate.crt')
  };
  server = https.createServer(options);
} else {
  const http = require('http');
  server = http.createServer();
}

let wss = new WSServer({
  server: server
})

server.on('request', app);

require('./websocket/index')(wss);

server.listen(process.env.PORT, () => {
  console.log('Server is runing on: ' + process.env.PORT);
});

module.exports = server;